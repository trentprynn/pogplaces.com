import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { prisma } from 'prisma/client'

type CreateNewJWTPayload = {
  userId: string
  email: string
}

type ParsedJWTPayload = {
  userId: string
  email: string
  iat: number
  exp: number
}

type TokenReturnObject = {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  public async validateLoginAndGenerateAuthToken(email: string, password: string) {
    // find a user for by the given email address
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    // verify the user exists and the given password is correct
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // every time a user successfully logs in, cleanup their expired refresh tokens (this is done to avoid having to
      // do this in a cron-like action)
      await this.cleanupExpiredRefreshTokensByUserId(user.userId)

      // create and return a new JWT for the user that just logged in
      const jwtPayload: CreateNewJWTPayload = {
        userId: user.userId,
        email: user.email,
      }
      return await this.constructTokenFromPayloadAndStoreRefreshToken(jwtPayload)
    }

    // user with given email not found or password incorrect
    throw new UnauthorizedException('Invalid username or password')
  }

  public async refreshToken(refreshToken: string) {
    let refreshTokenData!: ParsedJWTPayload
    try {
      refreshTokenData = await this.jwtService.verifyAsync<ParsedJWTPayload>(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        ignoreExpiration: false,
      })
    } catch (e: any) {
      throw new BadRequestException('Invalid refresh token')
    }

    const userRefreshTokens = await prisma.refreshToken.findMany({
      where: {
        userId: refreshTokenData.userId,
      },
    })

    // the user gave a valid refresh token we issued, ensure it hasn't been revoked by checking that we have it
    // stored in the user's refresh tokens in the database
    let userRefreshTokenHashMatch: string | undefined = undefined
    for (let i = 0; i < userRefreshTokens.length; i++) {
      if (await bcrypt.compare(refreshToken, userRefreshTokens[i].refreshTokenHash)) {
        userRefreshTokenHashMatch = userRefreshTokens[i].refreshTokenHash
      }
    }

    if (userRefreshTokenHashMatch) {
      // the refresh token the user sent is both valid and non-revoked, remove it from the store so it can't be
      // used again
      await prisma.refreshToken.delete({
        where: {
          refreshTokenHash_userId: { userId: refreshTokenData.userId, refreshTokenHash: userRefreshTokenHashMatch },
        },
      })

      // every time a user successfully refreshes an access token, cleanup their expired refresh tokens (this is done
      // to avoid having to do this in a cron-like action)
      await this.cleanupExpiredRefreshTokensByUserId(refreshTokenData.userId)

      // use the parsed, valid refresh token's data to generate a full new auth token for the calling user
      const newAuthTokenPayload: CreateNewJWTPayload = {
        userId: refreshTokenData.userId,
        email: refreshTokenData.email,
      }
      return this.constructTokenFromPayloadAndStoreRefreshToken(newAuthTokenPayload)
    } else {
      // User gave a valid refresh token but it wasn't stored in the database, this probably means
      // it was revoked
      throw new BadRequestException('Token cryptographically valid but not found (likely revoked)')
    }
  }

  public async deleteRefreshTokenForUser(userId: string, refreshToken: string) {
    // validate given refresh JWT is valid
    try {
      await this.jwtService.verifyAsync<ParsedJWTPayload>(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        ignoreExpiration: false,
      })
    } catch (e: any) {
      throw new BadRequestException('Invalid refresh token, cannot delete')
    }

    // grab the refresh tokens for the given user
    const userRefreshTokens = await prisma.refreshToken.findMany({
      where: {
        AND: {
          userId: userId,
        },
      },
    })

    // search for a matching token hash for the given user + refresh token combination
    for (let i = 0; i < userRefreshTokens.length; i++) {
      if (await bcrypt.compare(refreshToken, userRefreshTokens[i].refreshTokenHash)) {
        // found a matching refresh token hash for the refresh token the user is trying to delete
        const matchingRefreshTokenHash = userRefreshTokens[i].refreshTokenHash

        // delete matching refresh token from the database
        await prisma.refreshToken.delete({
          where: {
            refreshTokenHash_userId: { userId: userId, refreshTokenHash: matchingRefreshTokenHash },
          },
        })

        // cleanup any other user refresh tokens (do this to avoid having to do this in a cron-like action)
        await this.cleanupExpiredRefreshTokensByUserId(userId)

        return
      }
    }

    // if we get here the refresh token the user gave is valid but it's already been deleted / removed
    throw new NotFoundException(`Refresh token ${refreshToken} not found for ${userId}`)
  }

  public async deleteAllRefreshTokensForUser(userId: string) {
    return await prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    })
  }

  private async constructTokenFromPayloadAndStoreRefreshToken(jwtPayload: CreateNewJWTPayload) {
    // create our signed token return object which has the access token + refresh tokens setup
    const returnObject: TokenReturnObject = {
      access_token: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET') as string,
        expiresIn: parseInt(this.configService.get<string>('JWT_LIFE_SECONDS') as string, 10),
      }),
      expires_in: parseInt(this.configService.get<string>('JWT_LIFE_SECONDS') as string, 10),
      refresh_token: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') as string,
        expiresIn: parseInt(this.configService.get<string>('REFRESH_TOKEN_LIFE_SECONDS') as string, 10),
      }),
      refresh_token_expires_in: parseInt(this.configService.get<string>('REFRESH_TOKEN_LIFE_SECONDS') as string, 10),
    }

    // add the refresh tokens to our store of refresh tokens for a specific user, we do this so we can
    // revoke refresh tokens by deleting them from the store if the user changes their password etc
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + returnObject.refresh_token_expires_in)
    await prisma.refreshToken.create({
      data: {
        refreshTokenHash: await bcrypt.hash(returnObject.refresh_token, 10),
        expiration: expiration,
        userId: jwtPayload.userId,
      },
    })

    return returnObject
  }

  private async cleanupExpiredRefreshTokensByUserId(userId: string) {
    return await prisma.refreshToken.deleteMany({
      where: {
        AND: {
          userId: userId,
          expiration: {
            lt: new Date(),
          },
        },
      },
    })
  }
}
