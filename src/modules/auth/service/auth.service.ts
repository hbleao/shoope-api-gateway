import type { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	private readonly jwtService;
	private readonly httpService;

	constructor(jwtService: JwtService, httpService: HttpService) {
		this.jwtService = jwtService;
		this.httpService = httpService;
	}

	validateJwtToken() {}
	validateSessionToken() {}
	login() {}
	register() {}
}
