import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly appUrl: string;

  constructor(private configService: ConfigService) {
    this.fromEmail =
      this.configService.get<string>("EMAIL_FROM") || "noreply@unistudy.ng";
    this.appUrl =
      this.configService.get<string>("APP_URL") || "http://localhost:3000";
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.appUrl}/verify-email?token=${token}`;

    const subject = "Verify Your UniStudy Account";
    const html = this.getVerificationTemplate(verificationUrl);

    await this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.appUrl}/reset-password?token=${token}`;

    const subject = "Reset Your Password";
    const html = this.getPasswordResetTemplate(resetUrl);

    await this.sendEmail(email, subject, html);
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const subject = "Welcome to UniStudy!";
    const html = this.getWelcomeTemplate(firstName);

    await this.sendEmail(email, subject, html);
  }

  async sendQuizCompletionEmail(
    email: string,
    data: {
      courseName: string;
      score: number;
      totalQuestions: number;
    }
  ): Promise<void> {
    const subject = `Quiz Completed: ${data.courseName}`;
    const html = this.getQuizCompletionTemplate(data);

    await this.sendEmail(email, subject, html);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    const emailProvider = this.configService.get<string>("EMAIL_PROVIDER");

    if (!emailProvider || emailProvider === "console") {
      this.logger.log(`\n📧 Email (${to}):\nSubject: ${subject}\n${html}\n`);
      return;
    }

    try {
      // Here you can integrate with actual email providers:
      // - Resend (recommended for Nigerian devs)
      // - SendGrid
      // - AWS SES
      // - Mailgun

      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  private getVerificationTemplate(verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 UniStudy</h1>
        </div>
        <div style="background: #fff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
          <p>Thank you for signing up! Click the button below to verify your email and activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: #22d3ee; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Verify Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link: <br><a href="${verificationUrl}" style="color: #22d3ee;">${verificationUrl}</a></p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
        </div>
        <div style="background: #fff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the button below to create a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #f97316; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link: <br><a href="${resetUrl}" style="color: #f97316;">${resetUrl}</a></p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This link expires in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to UniStudy</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to UniStudy!</h1>
        </div>
        <div style="background: #fff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hi ${firstName}!</h2>
          <p>Your account has been successfully created. You now have access to:</p>
          <ul style="color: #666; padding-left: 20px;">
            <li><strong>AI Tutor</strong> - Get instant help with your studies</li>
            <li><strong>Smart Quizzes</strong> - Test your knowledge and track progress</li>
            <li><strong>Study Materials</strong> - Upload and organize your notes</li>
            <li><strong>Progress Tracking</strong> - Monitor your learning journey</li>
          </ul>
          <p>Ready to start your learning journey?</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.appUrl}/dashboard" style="background: #22d3ee; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Go to Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getQuizCompletionTemplate(data: {
    courseName: string;
    score: number;
    totalQuestions: number;
  }): string {
    const percentage = Math.round((data.score / data.totalQuestions) * 100);
    const emoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quiz Completed</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${emoji} Quiz Completed!</h1>
        </div>
        <div style="background: #fff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Great job!</h2>
          <p>You completed the quiz for <strong>${data.courseName}</strong></p>
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 8px;">
            <div style="font-size: 48px; font-weight: bold; color: #22d3ee; margin-bottom: 10px;">${percentage}%</div>
            <div style="color: #666;">${data.score} out of ${data.totalQuestions} correct</div>
          </div>
          <p style="color: #666;">${percentage >= 80 ? "Excellent work! Keep it up!" : percentage >= 60 ? "Good effort! Review the areas you missed." : "Keep practicing! Every attempt makes you stronger."}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.appUrl}/dashboard/quizzes" style="background: #22d3ee; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">View Details</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
