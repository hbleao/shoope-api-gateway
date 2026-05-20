/** biome-ignore-all lint/style/useImportType: <> */
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { serviceConfig } from "src/config/gateway.config";

@Injectable()
export class ProxyService {
	private readonly logger = new Logger(ProxyService.name);
	private readonly httpService: HttpService;

	constructor(httpService: HttpService) {
		this.httpService = httpService;
	}

	async proxyRequest(
		serviceName: keyof typeof serviceConfig,
		method: string,
		path: string,
		data?: any,
		headers?: any,
		userInfo?: any,
	): Promise<Record<string, any>> {
		const service = serviceConfig[serviceName];
		const url = `${service.url}${path}`;

		this.logger.log(`Proxying ${method} request to ${serviceName}: ${url}`);

		try {
			const enhancedHeaders = {
				...headers,
				"x-user-id": userInfo?.id,
				"x-user-email": userInfo?.email,
				"x-user-role": userInfo?.role,
			};

			const httpRequest = this.httpService.request({
				method: method.toLowerCase(),
				url,
				data: data,
				headers: enhancedHeaders,
				timeout: service.timeout,
			});

			return await firstValueFrom(httpRequest);
		} catch (error) {
			this.logger.error(
				`Error proxying ${method} request to ${serviceName}: ${error}`,
			);
			throw error;
		}
	}

	async getServiceHealth(
		serviceName: keyof typeof serviceConfig,
	): Promise<Record<string, any>> {
		try {
			const service = serviceConfig[serviceName];
			const url = `${service.url}/health`;
			const httpRequest = this.httpService.get(url, {
				timeout: service.timeout,
			});

			const firstValueHttpRequest = await firstValueFrom(httpRequest);

			return {
				status: "healthy",
				data: firstValueHttpRequest.data,
			};
		} catch (error: any) {
			return {
				status: "unhealthy",
				error: error.message,
			};
		}
	}
}
