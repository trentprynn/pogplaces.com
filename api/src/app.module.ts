import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { PlacesModule } from './places/places.module'
import { SharedModule } from './shared/shared.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    UserModule,
    PlacesModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {
  static port?: string | undefined

  constructor(configService: ConfigService) {
    AppModule.port = configService.get('PORT')
  }
}
