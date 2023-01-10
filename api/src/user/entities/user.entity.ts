import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEmail, IsString } from 'class-validator'

// note: this entity purposefully does not implement the prisma.User generated type as that
//       type contains the user's password hash which we never want to return to the user
export class UserEntity {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({ type: String, nullable: true })
  name: string | null

  @ApiProperty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  constructor(userId: string, email: string, name: string | null, createdAt: Date, updatedAt: Date) {
    this.userId = userId
    this.email = email
    this.name = name
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
