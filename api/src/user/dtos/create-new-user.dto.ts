import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateNewUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string

  @ApiProperty()
  @IsNotEmpty()
  password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}
