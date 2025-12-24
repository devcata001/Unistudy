import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 3001;

  // Global prefix
  app.setGlobalPrefix("api");

  // CORS configuration - Allow all origins in production
  app.enableCors({
    origin: true, // Allow all origins for now
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // Cookie parser
  app.use(cookieParser());

  // Global validation pipe
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

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle("LAUTECH Study Hub API")
    .setDescription("AI-powered gamified study platform API")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management")
    .addTag("courses", "Course management")
    .addTag("materials", "Study materials")
    .addTag("ai", "AI tutor")
    .addTag("quizzes", "Quiz management")
    .addTag("gamification", "Gamification features")
    .addTag("leaderboard", "Leaderboard")
    .addTag("study-groups", "Study groups")
    .addTag("progress", "Progress tracking")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
