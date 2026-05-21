import { ExecutionContext, Injectable } from "@nestjs/common";
import {
	ThrottlerException,
	ThrottlerGuard,
	ThrottlerRequest,
} from "@nestjs/throttler";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	protected async getTracker(req: Record<string, any>): Promise<string> {
		return `${req.ip}-${req.headers["user-agent"]}`;
	}

	protected async handleRequest(
		throttlerRequest: ThrottlerRequest,
	): Promise<boolean> {
		const { context, limit, ttl, throttler } = throttlerRequest;

		const { req, res } = this.getRequestResponse(context);

		const throttlerName = throttler.name || "default";
		const hitCount = 1;

		const tracker = await this.getTracker(req);
		const key = this.generateKey(context, tracker, throttlerName);

		const totalHits = await this.storageService.increment(
			key,
			ttl,
			limit,
			hitCount,
			throttlerName,
		);

		if (Number(totalHits) > limit) {
			res.setHeader("Retry-After", Math.round(ttl / 1000));
			throw new ThrottlerException("Rate limit exceeded");
		}

		res.setHeader(`${this.headerPrefix}-Limit`, limit.toString());
		res.setHeader(
			`${this.headerPrefix}-Remaining`,
			(limit - Number(totalHits)).toString(),
		);
		res.setHeader(
			`${this.headerPrefix}-Reset`,
			Math.round(ttl / 1000).toString(),
		);

		return true;
	}
}
