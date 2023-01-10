import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { prisma } from 'prisma/client'
import { UpdateUserDTO } from '../dtos/update-user.dto'
import { UserEntity } from '../entities/user.entity'

@Injectable()
export class UserService {
  public async findUserByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`)
    }

    const returnUser: UserEntity = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return returnUser
  }

  public async findUserById(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        userId: userId,
      },
    })

    if (!user) {
      throw new NotFoundException(`User with userId '${userId}' not found`)
    }

    const returnUser: UserEntity = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return returnUser
  }

  public async createUser(email: string, password: string) {
    if (
      await prisma.user.findFirst({
        where: {
          email: email,
        },
      })
    ) {
      throw new BadRequestException(`User with email ${email} already exists`)
    }

    const createdUser = await prisma.user.create({
      data: {
        email: email,
        passwordHash: await bcrypt.hash(password, 10),
      },
    })

    const returnUser: UserEntity = {
      userId: createdUser.userId,
      email: createdUser.email,
      name: createdUser.name,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    }

    return returnUser
  }

  public async updateUser(userId: string, updatedUser: UpdateUserDTO) {
    const userWithUpdatedUserEmail = await prisma.user.findFirst({
      where: {
        email: updatedUser.email,
      },
    })

    if (userWithUpdatedUserEmail && userWithUpdatedUserEmail.userId !== userId) {
      // user trying to switch their email to an email that's already registered
      throw new BadRequestException(`User with email ${updatedUser.email} already exists`)
    }

    const modifiedUser = await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
      },
    })

    const returnUser: UserEntity = {
      userId: modifiedUser.userId,
      email: modifiedUser.email,
      name: modifiedUser.name,
      createdAt: modifiedUser.createdAt,
      updatedAt: modifiedUser.updatedAt,
    }

    return returnUser
  }

  public async deleteUser(userId: string) {
    const deletedUser = await prisma.user.delete({
      where: {
        userId: userId,
      },
    })

    const returnUser: UserEntity = {
      userId: deletedUser.userId,
      email: deletedUser.email,
      name: deletedUser.name,
      createdAt: deletedUser.createdAt,
      updatedAt: deletedUser.updatedAt,
    }

    return returnUser
  }
}
