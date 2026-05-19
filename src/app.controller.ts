/** biome-ignore-all lint/style/useImportType: <> */
import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";
import { ProxyService } from "./proxy/service/proxy/proxy.service";

@Controller()
export class AppController {
	private readonly appService: AppService;
	private readonly proxyService: ProxyService;

	constructor(appService: AppService, proxyService: ProxyService) {
		this.appService = appService;
		this.proxyService = proxyService;
	}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get("health")
	async getHealth() {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
			services: {
				users: await this.proxyService.getServiceHealth("users"),
				products: await this.proxyService.getServiceHealth("products"),
				checkout: await this.proxyService.getServiceHealth("checkout"),
				payments: await this.proxyService.getServiceHealth("payments"),
			},
		};
	}
}
