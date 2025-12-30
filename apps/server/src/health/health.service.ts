import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async check() {
    const checks = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>("NODE_ENV"),
      version: "1.0.0",
      database: await this.checkDatabase(),
      memory: this.getMemoryUsage(),
    };

    return checks;
  }

  private async checkDatabase(): Promise<{
    status: string;
    responseTime?: number;
  }> {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - start;

      return {
        status: "healthy",
        responseTime,
      };
    } catch (error) {
      this.logger.error("Database health check failed:", error);
      return {
        status: "unhealthy",
      };
    }
  }

  private getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    };
  }
}
