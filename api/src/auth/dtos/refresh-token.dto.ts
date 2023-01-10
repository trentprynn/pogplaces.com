import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string

  constructor(refresh_token: string) {
    this.refresh_token = refresh_token
  }
}
