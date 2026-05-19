import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggingMiddleware } from "./middleware/logging/logging.middleware";
import { MiddlewareModule } from "./middleware/middleware.module";
import { ProxyModule } from "./proxy/proxy.module";

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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*");
	}
}
