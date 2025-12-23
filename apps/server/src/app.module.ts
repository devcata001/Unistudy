import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CoursesModule } from "./courses/courses.module";
import { MaterialsModule } from "./materials/materials.module";
import { AiModule } from "./ai/ai.module";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { UniversitiesModule } from "./universities/universities.module";
// Note: The following modules were deleted during fixing attempts and need to be recreated:
// - GamificationModule
// - LeaderboardModule
// - StudyGroupsModule
// - ProgressModule

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    MaterialsModule,
    AiModule,
    QuizzesModule,
    UniversitiesModule,
    // GamificationModule, // DELETED - needs to be recreated
    // LeaderboardModule, // DELETED - needs to be recreated
    // StudyGroupsModule, // DELETED - needs to be recreated
    // ProgressModule, // DELETED - needs to be recreated
  ],
})
export class AppModule {}
