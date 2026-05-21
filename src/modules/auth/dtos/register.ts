import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

enum RoleEnum {
	User = "user",
	Admin = "admin",
	Seller = "seller",
}

export class RegisterDto {
	@ApiProperty({
		description: "User first name",
		example: "John",
	})
	firstName: string;

	@ApiProperty({
		description: "User last name",
		example: "Doe",
	})
	lastName: string;

	@ApiProperty({
		description: "User email",
		example: "user@example.com",
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: "User password",
		example: "@Password123",
		minLength: 6,
	})
	@IsString()
	@MinLength(6)
	password: string;

	@ApiProperty({
		description: "User role",
		example: "user",
	})

	@ApiProperty({
		description: "User role",
		example: "user",
		enum: Object.values(RoleEnum),
		required: false,
	})
	@IsOptional()
	@IsString()
	role?: RoleEnum;
}
