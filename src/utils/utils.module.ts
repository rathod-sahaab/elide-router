import { Global, Module } from '@nestjs/common'
import { CookieService } from './cookie.service'
import { CryptoService } from './crypto.service'
import { HelperService } from './helper.service'
import { ElideMailService } from './mail.service'

@Global()
@Module({
	providers: [CryptoService, CookieService, HelperService, ElideMailService],
	exports: [CryptoService, CookieService, HelperService, ElideMailService],
})
export class UtilsModule {}
