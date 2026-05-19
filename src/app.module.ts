import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./modules/auth/auth.module";
import { LoggingMiddleware } from "./modules/middleware/logging/logging.middleware";
import { MiddlewareModule } from "./modules/middleware/middleware.module";
import { ProxyModule } from "./modules/proxy/proxy.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000, // 1 minute
				limit: 100, // request per minute
			},
		]),
		ProxyModule,
		MiddlewareModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*");
	}
}
