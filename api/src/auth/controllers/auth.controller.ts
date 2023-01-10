import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LoginDTO } from '../dtos/login.dto'
import { RefreshTokenDTO } from '../dtos/refresh-token.dto'
import { TokenReturnDTO } from '../dtos/token-return.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { AuthService } from '../services/auth.service'
import { AuthenticatedRequest } from '../types/authenticated-request.type'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Generate a new auth token using email / password' })
  @ApiCreatedResponse({
    description: 'The new auth token information',
    type: TokenReturnDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.validateLoginAndGenerateAuthToken(body.email, body.password)
  }

  @ApiOperation({ summary: 'Generate a new auth token using a previously created refresh token' })
  @ApiCreatedResponse({
    description: 'The new auth token information',
    type: TokenReturnDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDTO) {
    console.log('REFRESHING TOKEN')
    return this.authService.refreshToken(body.refresh_token)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete a refresh token` })
  @ApiResponse({ status: 200, description: 'Refresh token successfully deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard)
  @Delete('refresh-token')
  async deleteRefreshToken(@Req() req: AuthenticatedRequest, @Body() body: RefreshTokenDTO) {
    console.log(`DELETING REFRESH TOKEN`)
    return this.authService.deleteRefreshTokenForUser(req.user.id, body.refresh_token)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete all refresh tokens` })
  @ApiResponse({ status: 200, description: 'All refresh tokens deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete('refresh-tokens')
  async deleteAllRefreshTokens(@Req() req: AuthenticatedRequest) {
    console.log(`DELETING ALL REFRESH TOKENS FOR USER`)
    return this.authService.deleteAllRefreshTokensForUser(req.user.id)
  }
}
