import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class PlacesService {
  constructor(private readonly httpService: HttpService) {}

  public async getPlaceRecommendationsBySearchString(search: string) {
    console.log('GETTING PLACE RECOMMENDATIONS')
    console.log(search)

    // get LAT + LNG from search string
    const geoCodeResponse = await firstValueFrom(
      this.httpService
        .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: `${search},US`,
            key: `${process.env.GOOGLE_MAPS_API_KEY}`,
          },
        })
        .pipe(
          catchError((err) => {
            console.log('ERROR HERE')
            console.log(err)
            throw 'An error happened!'
          })
        )
    )

    console.log('GOT GEO CODE RESPONSE')

    console.log(geoCodeResponse.data)
    if (!geoCodeResponse.data.results[0] || !geoCodeResponse.data.results[0].geometry) {
      throw new BadRequestException(`Failed to get location data for ${search}`)
    }
    const lat = geoCodeResponse.data.results[0].geometry.location['lat']
    const lng = geoCodeResponse.data.results[0].geometry.location['lng']

    console.log(`SEARCHING AT ${lat}, ${lng}`)

    // GET PLACE RECOMMENDATIONS FROM LAT + LNG
    const getPlacesResponse = await firstValueFrom(
      this.httpService
        .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
          params: {
            location: `${lat}, ${lng}`,
            type: 'restaurant',
            rankby: 'distance',
            key: `${process.env.GOOGLE_MAPS_API_KEY}`,
          },
        })
        .pipe(
          catchError((err) => {
            console.log('ERROR HERE')
            console.log(err)
            throw 'An error happened!'
          })
        )
    )

    return getPlacesResponse.data
  }

  public async getMorePlaceRecommendations(pageToken: string) {
    console.log('GETTING PLACE RECOMMENDATIONS')

    // GET MORE RESULTS FROM PREVIOUS USER SEARCH PAGE TOKEN
    const { data } = await firstValueFrom(
      this.httpService
        .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
          params: {
            pagetoken: pageToken,
            key: `${process.env.GOOGLE_MAPS_API_KEY}`,
          },
        })
        .pipe(
          catchError((err) => {
            console.log('ERROR HERE')
            console.log(err)
            throw 'An error happened!'
          })
        )
    )

    return data
  }
}
