import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RecommendationResponse {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  example: string

  constructor(example: string) {
    this.example = example
  }
}
