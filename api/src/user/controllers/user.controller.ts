import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type'
import { CreateNewUserDTO } from '../dtos/create-new-user.dto'
import { UpdateUserDTO } from '../dtos/update-user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserService } from '../services/user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: `Create a new user` })
  @ApiCreatedResponse({
    description: 'The new user',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  async createUser(@Body() body: CreateNewUserDTO) {
    console.log('CREATE USER')
    return this.userService.createUser(body.email, body.password)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get the calling user's information such as email` })
  @ApiOkResponse({
    description: 'The user',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Req() req: AuthenticatedRequest) {
    console.log('GET USER')
    return this.userService.findUserById(req.user.id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Update user information` })
  @ApiOkResponse({
    description: 'The updated user',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(@Req() req: AuthenticatedRequest, @Body() body: UpdateUserDTO) {
    console.log('UPDATE USER')
    return this.userService.updateUser(req.user.id, body)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete account` })
  @ApiOkResponse({
    description: 'The deleted user',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req: AuthenticatedRequest) {
    console.log('DELETE USER')
    return this.userService.deleteUser(req.user.id)
  }
}
