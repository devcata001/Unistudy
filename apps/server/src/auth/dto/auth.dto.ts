import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "john.doe@university.edu.ng" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: "University of Lagos", required: false })
  @IsString()
  @IsOptional()
  university?: string;

  @ApiProperty({ example: "Computer Science", required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: "Faculty of Engineering", required: false })
  @IsString()
  @IsOptional()
  faculty?: string;

  @ApiProperty({ example: "400", required: false })
  @IsString()
  @IsOptional()
  @IsEnum(["100", "200", "300", "400", "500"])
  level?: string;

  @ApiProperty({ example: "CSC/2020/001", required: false })
  @IsString()
  @IsOptional()
  matricNumber?: string;
}

export class LoginDto {
  @ApiProperty({ example: "john.doe@lautech.edu.ng" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: "john.doe@lautech.edu.ng" })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: "NewSecurePass123!" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
