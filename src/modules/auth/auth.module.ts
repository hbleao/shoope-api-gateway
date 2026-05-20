import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, type ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./service/auth.service";

@Module({
	imports: [
		PassportModule,
		HttpModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET"),
				signOptions: { expiresIn: "24h" },
			}),
			inject: [ConfigModule],
		}),
	],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
