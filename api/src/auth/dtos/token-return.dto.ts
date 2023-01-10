import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class TokenReturnDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  access_token: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  expires_in: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  refresh_token_expires_in: number

  constructor(access_token: string, expires_in: number, refresh_token: string, refresh_token_expires_in: number) {
    this.access_token = access_token
    this.expires_in = expires_in
    this.refresh_token = refresh_token
    this.refresh_token_expires_in = refresh_token_expires_in
  }
}
