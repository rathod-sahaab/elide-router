import { Global, Module } from '@nestjs/common'
import { CryptoService } from './crypto.service'
import { HelperService } from './helper.service'

@Global()
@Module({
	providers: [CryptoService, HelperService],
	exports: [CryptoService, HelperService],
})
export class UtilsModule {}
