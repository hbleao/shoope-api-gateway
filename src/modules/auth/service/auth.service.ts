import { HttpService } from "@nestjs/axios";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { firstValueFrom } from "rxjs";
import { serviceConfig } from "src/config/gateway.config";
import type { LoginDto } from "../dtos/login";
import type { UserSession } from "../interface/user-session.interface";

@Injectable()
export class AuthService {
	private readonly jwtService: JwtService;
	private readonly httpService: HttpService;

	constructor(jwtService: JwtService, httpService: HttpService) {
		this.jwtService = jwtService;
		this.httpService = httpService;
	}

	validateJwtToken(token: string) {
		try {
			const isValidToken = this.jwtService.verify(token);
			return isValidToken;
		} catch {
			throw new UnauthorizedException("Invalid JWT token");
		}
	}

	async validateSessionToken(sessionToken: string): Promise<UserSession> {
		try {
			const url = `${serviceConfig.users.url}/session/validate/${sessionToken}`;
			const timeout = serviceConfig.users.timeout;

			const { data } = await firstValueFrom(
				this.httpService.get(url, { timeout }),
			);

			return data;
		} catch {
			throw new UnauthorizedException("Invalid session token");
		}
	}

	async login(loginDto: LoginDto) {
		try {
			const url = `${serviceConfig.users.url}/login`;
			const timeout = serviceConfig.users.timeout;

			const { data } = await firstValueFrom(
				this.httpService.post(url, loginDto, { timeout }),
			);

			return data;
		} catch {
			throw new UnauthorizedException("Invalid login credentials");
		}
	}

	async register(registerDto: any) {
		try {
			const url = `${serviceConfig.users.url}/auth/register`;
			const timeout = serviceConfig.users.timeout;

			const { data } = await firstValueFrom(
				this.httpService.post(url, registerDto, { timeout }),
			);

			return data;
		} catch {
			throw new UnauthorizedException("Registration failed");
		}
	}
}
