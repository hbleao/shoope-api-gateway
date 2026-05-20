import { IsEmail, IsString } from "class-validator";

export class PayloadValidateDto {
	@IsString()
	token: string;

	@IsString()
	sub: string;

	@IsEmail()
	email: string;

	@IsString()
	role: string;
}
