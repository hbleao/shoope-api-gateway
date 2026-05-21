import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class PayloadValidateDto {
	@ApiProperty({ description: "User token" })
	@IsString()
	token: string;

	@ApiProperty({ description: "User sub" })
	@IsString()
	sub: string;

	@ApiProperty({ description: "User email" })
	@IsEmail()
	email: string;

	@ApiProperty({ description: "User role" })
	@IsString()
	role: string;
}
