import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminAuthService {
  private adminPassword: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.adminPassword =
      this.configService.get<string>("ADMIN_PASSWORD") || "changeme";
  }

  async validateAdmin(username: string, password: string): Promise<any> {
    const adminUsername =
      this.configService.get<string>("ADMIN_USERNAME") || "admin";
    if (username !== adminUsername) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = password === this.adminPassword;
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      username: adminUsername,
      role: "SUPER_ADMIN",
    };
  }

  async login(username: string, password: string) {
    const admin = await this.validateAdmin(username, password);

    const payload = { username: admin.username, role: admin.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: "24h" }),
      admin: {
        username: admin.username,
        role: admin.role,
      },
    };
  }

  async changePassword(oldPassword: string, newPassword: string) {
    if (oldPassword !== this.adminPassword) {
      throw new BadRequestException("Current password is incorrect");
    }

    if (newPassword.length < 8) {
      throw new BadRequestException(
        "New password must be at least 8 characters"
      );
    }

    this.adminPassword = newPassword;
    return { message: "Password changed successfully" };
  }

  getCurrentPassword(): string {
    return this.adminPassword;
  }
}
