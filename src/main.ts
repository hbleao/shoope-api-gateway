import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { allowedOrigins } from "./helpers";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					imgSrc: ["'self'", "data", "https:"],
				},
			},
			crossOriginEmbedderPolicy: false,
			hsts: {
				maxAge: 31536000,
				includeSubDomains: true,
				preload: true,
			},
		}),
	);

	app.enableCors({
		origin: allowedOrigins,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
			"Access-Control-Request-Method",
			"Access-Control-Request-Headers",
		],
		credentials: true,
		maxAge: 86400, // 24 horas
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
		.setDescription(`API Gateway para o sistema de marketplace Shoope`)
		.setLicense("MIT", "")
		.setVersion("1.0.0")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				name: "JWT",
				description: "Enter JWT token",
				in: "header",
			},
			"JWT-auth",
		)
		.addTag("Authentication", "Endpoints de autenticação e autorização")
		.addTag("Users", "Endpoints de gestão de usuários")
		.addTag("Products", "Endpoints de gestão de produtos")
		.addTag("Checkout", "Endpoints de gestão de checkout")
		.addTag("Payments", "Endpoints de gestão de pagamentos")
		.addTag("App", "Endpoints de verificação de saúde da aplicação Shoope")
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
