import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "src/modules/auth/service/auth.service";

@Injectable()
export class SessionGuard implements CanActivate {
	private readonly authService: AuthService;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const sessionToken = request.headers["x-session-token"];

		if (sessionToken)
			throw new UnauthorizedException("Session token is required");

		try {
			const session = await this.authService.validateSessionToken(sessionToken);

			if (!session.valid || !session.user)
				throw new UnauthorizedException("Invalid session token");

			request.user = session.user;

			return true;
		} catch {
			throw new UnauthorizedException("Invalid session token");
		}
	}
}
