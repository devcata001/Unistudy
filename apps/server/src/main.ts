import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 3001;
  const nodeEnv = configService.get<string>("NODE_ENV") || "development";

  app.setGlobalPrefix("api");

  app.use(
    helmet({
      contentSecurityPolicy: nodeEnv === "production" ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  const allowedOrigins = configService
    .get<string>("ALLOWED_ORIGINS")
    ?.split(",") || ["http://localhost:3000", "http://localhost:3001"];

  app.enableCors({
    origin: nodeEnv === "production" ? allowedOrigins : true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("UniStudy API")
    .setDescription("AI-powered learning platform for Nigerian universities")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Authentication & authorization")
    .addTag("users", "User management")
    .addTag("courses", "Course management")
    .addTag("materials", "Study materials")
    .addTag("ai", "AI tutor")
    .addTag("quizzes", "Quiz system")
    .addTag("admin", "Admin operations")
    .addTag("universities", "University data")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🔒 Security: Helmet enabled, CORS configured`);
  logger.log(`⚡ Environment: ${nodeEnv}`);
}

bootstrap();
