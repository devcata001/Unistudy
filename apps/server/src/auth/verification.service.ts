import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import * as crypto from "crypto";

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // Store token in database
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationExpiry: expiresAt,
      },
    });

    // Send email
    await this.emailService.sendVerificationEmail(email, token);
  }

  async verifyEmail(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    // Mark email as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Email already verified");
    }

    await this.sendVerificationEmail(user.id, user.email);
  }

  async checkVerificationStatus(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isEmailVerified: true },
    });

    return user?.isEmailVerified || false;
  }
}
