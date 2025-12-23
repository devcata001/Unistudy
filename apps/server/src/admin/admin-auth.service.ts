import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

// Store admin credentials (in production, move to database)
const ADMIN_CREDENTIALS = {
  username: "cyb3rcatalyst",
  // Hashed version of 'UTMEscore@336'
  passwordHash: "$2b$10$YourHashedPasswordWillBeHere", // We'll set this properly
};

@Injectable()
export class AdminAuthService {
  private adminPassword: string = "UTMEscore@336"; // Store actual password temporarily

  constructor(private jwtService: JwtService) {}

  async validateAdmin(username: string, password: string): Promise<any> {
    if (username !== ADMIN_CREDENTIALS.username) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check password
    const isValid = password === this.adminPassword;
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      username: ADMIN_CREDENTIALS.username,
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
