import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "../dtos/login";
import { AuthService } from "../service/auth.service";
import { Throttle } from "@nestjs/throttler";
import { RegisterDto } from "../dtos/register";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	private readonly authService: AuthService;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "User login" })
	@ApiResponse({ status: 200, description: "Login successful" })
	@ApiResponse({ status: 401, description: "Invalid Credentials" })
	@Throttle({ short: { limit: 5, ttl: 60000 } })
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post("register")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: "User registration" })
	@ApiResponse({ status: 200, description: "Registration successful" })
	@ApiResponse({ status: 400, description: "Invalid registration data" })
	@Throttle({ short: { limit: 5, ttl: 60000 } })
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}
}
