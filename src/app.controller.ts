import { Controller, Get } from "@nestjs/common";

import { ProxyService } from "./modules/proxy/service/proxy/proxy.service";

@Controller()
export class AppController {
	private readonly proxyService: ProxyService;

	constructor(proxyService: ProxyService) {
		this.proxyService = proxyService;
	}

	@Get("Health")
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
