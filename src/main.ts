import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

	const configService = app.get(ConfigService)

	await app.register(fastifyCookie)
	await app.register(fastifyHelmet, {
		contentSecurityPolicy: {
			directives: {
				defaultSrc: [`'self'`],
			},
		},
	})

	app.enableCors({
		origin: configService.get('FRONTEND_URL'),
		credentials: true,
	})

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
			whitelist: true,
		}),
	)
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

	await app.listen(Number(configService.get('PORT')), '0.0.0.0')
	console.log(`Server is running on ${await app.getUrl()}`)
}
bootstrap()
