import { Module } from '@nestjs/common'
import { PlacesController } from './controllers/places.controller'
import { PlacesService } from './services/places.service'

@Module({
  providers: [PlacesService],
  exports: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
