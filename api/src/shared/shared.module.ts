import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  imports: [HttpModule],
  providers: [],
  exports: [HttpModule],
  controllers: [],
})
export class SharedModule {}
