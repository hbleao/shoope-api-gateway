import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly reflector: Reflector;

	constructor(reflector: Reflector) {
		super();

		this.reflector = reflector;
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride("isPublic", [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		return super.canActivate(context);
	}

	handleRequest<TUser = any>(err: any, user: any): TUser {
		if (err || !user) throw err || new UnauthorizedException();

		return user;
	}
}
