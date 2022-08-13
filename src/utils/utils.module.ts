import { Global, Module } from '@nestjs/common'
import { CryptoService } from './crypto.service'
import { HelperService } from './helper.service'
import { ElideMailService } from './mail.service'

@Global()
@Module({
	providers: [CryptoService, HelperService, ElideMailService],
	exports: [CryptoService, HelperService, ElideMailService],
})
export class UtilsModule {}
