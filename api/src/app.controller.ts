import { Controller, Get, Redirect } from '@nestjs/common'

import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('default')
@Controller('')
export class AppController {
  @ApiOperation({ summary: `Redirect from the root path to the API documentation` })
  @ApiResponse({ status: 302, description: 'redirection url' })
  @Get()
  @Redirect('api-docs', 302)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async apiDocsRedirect() {}

  @ApiOperation({ summary: `Perform a health check for the api server` })
  @ApiOkResponse({
    description: 'The health check response object.',
  })
  @Get('health')
  async getHealthCheck() {
    return {
      status: 'alive',
      serverTimeUTC: new Date().toUTCString(),
    }
  }
}
