import { Controller, Get, HttpStatus, Param, Redirect } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get(':slug')
	@Redirect('/', HttpStatus.TEMPORARY_REDIRECT)
	async visitLink(@Param('slug') slug: string) {
		// TODO: extract visitor information from cookie
		const url = await this.appService.visitLink({ slug })

		return { url }
	}
}
