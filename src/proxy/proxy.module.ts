import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ProxyService } from "./service/proxy/proxy.service";

@Module({
	imports: [HttpModule], // É uma lista de modulos que o modulo atual depende
	providers: [ProxyService], // É uma lista de providers que o modulo atual fornece
	exports: [ProxyService], // É uma lista de providers que o modulo atual exporta
})
export class ProxyModule {}
