import { Controller, Get, HttpStatus, Param, Redirect, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { isMongoId } from 'class-validator'
import { FastifyRequest } from 'fastify'
import { Types } from 'mongoose'
import { AppService } from './app.service'
import { FastifyReply } from './commons/types/fastify'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly configService: ConfigService,
	) {}

	@Get(':slug')
	@Redirect('/', HttpStatus.TEMPORARY_REDIRECT)
	async visitLink(
		@Req() req: FastifyRequest,
		@Res({ passthrough: true }) res: FastifyReply,
		@Param('slug') slug: string,
	) {
		const { url, linkId } = await this.appService.getLink({ slug })

		const visitorIdCookieName: string = this.configService.get('VISITOR_ID_COOKIE_NAME')
		const visitorIdCookie = req.cookies[visitorIdCookieName]

		const visitorId = isMongoId(visitorIdCookie)
			? visitorIdCookie
			: new Types.ObjectId().toString()

		await this.appService.analytics({
			linkId,
			visitorId,
			referer: req.headers.referer,
			ip: req.ip,
			time: new Date(),
			userAgent: req.headers['user-agent'],
		})

		if (visitorId !== visitorIdCookie) {
			// this means we generated new cookie
			res.setCookie(visitorIdCookieName, visitorId.toString())
		}

		return { url }
	}
}
