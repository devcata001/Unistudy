import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService, JwtPayload } from "../auth.service";
import { User } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(
    payload: any
  ): Promise<User | { username: string; role: string }> {
    // Check if this is an admin token (has username field instead of sub)
    if (payload.username && payload.role === "SUPER_ADMIN") {
      return {
        username: payload.username,
        role: payload.role,
      };
    }

    // Regular user token
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
