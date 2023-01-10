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
  @ApiOperation({ summary: `Get recommendations for a zip code` })
  @ApiOkResponse({
    description: 'The user',
    type: RecommendationResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(100)
  @UseInterceptors(CacheInterceptor)
  @Get(':search')
  async getUser(@Req() req: AuthenticatedRequest, @Param('search') search: string) {
    console.log('GET PLACES')
    return this.placesService.getPlaceRecommendationsBySearchString(search)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get additional recommendations for a zip code` })
  @ApiOkResponse({
    description: 'The user',
    type: RecommendationResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(100)
  @UseInterceptors(CacheInterceptor)
  @Get('/more-places/:pageCode')
  async getMorePlaces(@Req() req: AuthenticatedRequest, @Param('pageCode') pageCode: string) {
    console.log('GET MORE PLACES')
    return this.placesService.getMorePlaceRecommendations(pageCode)
  }
}
