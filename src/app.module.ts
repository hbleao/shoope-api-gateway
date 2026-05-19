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
				name: "short",
				ttl: 1000, // 1 second
				limit: 10, // 10 request per minute
			},
			{
				name: "medium",
				ttl: 60000, // 1 minute
				limit: 100, // request per minute
			},
			{
				name: "long",
				ttl: 900000, // 15 minutes
				limit: 1000, // request per minute
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
