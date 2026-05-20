/** biome-ignore-all lint/correctness/noUnreachableSuper: <explanation> */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { PayloadValidateDto } from "../dtos/payloadValidate";
import type { AuthService } from "../service/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly authService: AuthService;

	constructor(authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || "",
		});

		this.authService = authService;
	}

	async validate(payloadDto: PayloadValidateDto) {
		if (!payloadDto) throw new UnauthorizedException("Invalid payload token");

		const user = await this.authService.validateJwtToken(payloadDto.token);

		if (!user) throw new UnauthorizedException();

		return {
			userId: payloadDto.sub,
			email: payloadDto.email,
			role: payloadDto.role,
		};
	}
}
