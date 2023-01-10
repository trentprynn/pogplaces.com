import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module({
  imports: [SharedModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
