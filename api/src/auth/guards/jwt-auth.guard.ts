import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // absolutely shit way of checking info object but this is all untyped and we don't have access
    // to the nestjs passport types so we have to do it like this unfortunately

    if (info == 'JsonWebTokenError: invalid token') {
      // token is invalid / malformed
      console.log('JSON WEB TOKEN ERROR')
      throw new UnauthorizedException('Token invalid')
    }

    if (info == 'TokenExpiredError: jwt expired') {
      // token is expired
      console.log('JSON WEB TOKEN ERROR')
      throw new UnauthorizedException('Token invalid')
    }

    // token is MISSING
    return super.handleRequest(err, user, info, context, status)
  }
}
