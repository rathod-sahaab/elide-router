import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as SendGrid from '@sendgrid/mail'

export interface VerificationEmailTemplateData {
	name: string
	verificationLink: string
}

@Injectable()
export class ElideMailService {
	constructor(readonly configSerice: ConfigService) {
		SendGrid.setApiKey(configSerice.get('SENDGRID_API_KEY'))
	}

	private async send(mail: SendGrid.MailDataRequired) {
		console.log('Sending mail')
		const transport = await SendGrid.send(mail)
		// avoid this on production. use log instead :)
		console.log(`E-Mail sent to ${mail.to}`)
		return transport
	}

	async sendEmailVerification({
		email,
		data,
	}: {
		email: string
		data: VerificationEmailTemplateData
	}) {
		return this.send({
			from: {
				name: this.configSerice.get('EMAIL_ACCOUNTS_FROM_NAME'),
				email: this.configSerice.get('EMAIL_ACCOUNTS_FROM_EMAIL'),
			},
			to: email,
			templateId: this.configSerice.get('SENDGRID_VERIFY_ACCOUNT_TID'),
			dynamicTemplateData: data,
		})
	}
}
