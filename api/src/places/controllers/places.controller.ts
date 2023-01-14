import { CacheInterceptor, CacheTTL, Controller, Get, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common'

import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type'
import { RecommendationResponse } from '../dtos/recommendation-response.type'
import { PlacesService } from '../services/places.service'

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get recommendations place` })
  @ApiOkResponse({
    description: 'The place recommendation response',
    type: RecommendationResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(300)
  @UseInterceptors(CacheInterceptor)
  @Get(':searchString')
  async getUser(@Req() req: AuthenticatedRequest, @Param('searchString') searchString: string) {
    console.log('GET PLACES')
    return this.placesService.getPlaceRecommendationsBySearchString(searchString)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get additional recommendations for a previous search` })
  @ApiOkResponse({
    description: 'The additional places',
    type: RecommendationResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(300)
  @UseInterceptors(CacheInterceptor)
  @Get('/more-places/:pageCode')
  async getMorePlaces(@Req() req: AuthenticatedRequest, @Param('pageCode') pageCode: string) {
    console.log('GET MORE PLACES')
    return this.placesService.getMorePlaceRecommendations(pageCode)
  }
}
