import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
	private readonly reflector: Reflector;

	constructor(reflector: Reflector) {
		this.reflector = reflector;
	}

	canActivate(context: ExecutionContext) {
		const requiredRoles = this.reflector.getAllAndOverride("roles", [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) return true;

		const { user } = context.switchToHttp().getRequest();

		if (!user?.role) throw new ForbiddenException("User role not found");

		const hasRole = requiredRoles.includes(user.role);

		if (!hasRole)
			throw new ForbiddenException(
				`
        Access denied.
        Required roles: ${requiredRoles.join(", ")}
      `,
			);

		return true;
	}
}
