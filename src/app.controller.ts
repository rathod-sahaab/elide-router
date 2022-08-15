import { Controller, Get, HttpStatus, Param, Redirect, Req } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { AppService } from './app.service'
import { ElideMailService } from './utils/mail.service'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly mailService: ElideMailService,
	) {}

	@Get(':slug')
	@Redirect('/', HttpStatus.TEMPORARY_REDIRECT)
	async visitLink(@Req() req: FastifyRequest, @Param('slug') slug: string) {
		const url = await this.appService.getRedirectionUrl({ slug })

		await this.appService.analytics({
			visitorJwt: req.cookies['visitor-token'],
			referer: req.headers.referer,
			ip: req.ip,
			time: new Date(),
			userAgent: req.headers['user-agent'],
		})

		return { url }
	}
}
