import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    // Accept both database ADMIN role and SUPER_ADMIN from admin auth
    if (user.role !== Role.ADMIN && user.role !== "SUPER_ADMIN") {
      throw new ForbiddenException("Access denied. Admin privileges required.");
    }

    return true;
  }
}
