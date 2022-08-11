import { Controller, Get, HttpStatus, Param, Redirect } from '@nestjs/common'
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
	async visitLink(@Param('slug') slug: string) {
		// TODO: extract visitor information from cookie
		const url = await this.appService.visitLink({ slug })
		return { url }
	}

	@Get('verify/:token')
	async verifyEmail(@Param('token') token: string) {
		await this.mailService.sendEmailVerification({
			email: 'garson215924@mynamejewel.com',
			data: {
				name: 'Abhay',
				verificationLink: `https://elide.io/verify/${token}`,
			},
		})

		return { message: 'Verification email sent' }
	}
}
