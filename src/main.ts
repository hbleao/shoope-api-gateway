import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(helmet());

	app.enableCors({
		origin: process.env.CORS_ORIGIN || "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	const swaggerConfig = new DocumentBuilder()
		.setTitle("Shoope API Gateway")
		.setDescription("API Gateway for Shoope microservice")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("api", app, swaggerDocument);

	await app.listen(process.env.PORT ?? 3000);

	console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
	console.log(
		`📑 Swagger documentation: http://localhost:${process.env.PORT}/api`,
	);
}

bootstrap();
