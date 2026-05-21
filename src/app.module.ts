import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./modules/auth/auth.module";
import { LoggingMiddleware } from "./modules/middleware/logging/logging.middleware";
import { MiddlewareModule } from "./modules/middleware/middleware.module";
import { ProxyModule } from "./modules/proxy/proxy.module";
import { CustomThrottlerGuard } from "./common/guards/throttler/throttler.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => [
				{
					name: "short",
					ttl: 1000, // 1 second
					limit: configService.get<number>("RATE_LIMIT_SHORT", 10),
				},
				{
					name: "medium",
					ttl: 60000, // 1 minute
					limit: configService.get<number>("RATE_LIMIT_MEDIUM", 100),
				},
				{
					name: "long",
					ttl: 900000, // 15 minutes
					limit: configService.get<number>("RATE_LIMIT_LONG", 1000),
				},
			],
			inject: [ConfigService],
		}),
		ProxyModule,
		MiddlewareModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: CustomThrottlerGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*");
	}
}
