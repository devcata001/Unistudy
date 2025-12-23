import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, Role } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      // Prevent updating sensitive fields
      const { password, refreshToken, role, points, ...updateData } = data;

      // Convert level to string if it's a number
      const cleanedData: any = { ...updateData };
      if (
        cleanedData.level !== undefined &&
        typeof cleanedData.level === "number"
      ) {
        cleanedData.level = cleanedData.level.toString();
      }

      console.log("Updating user:", userId, "with data:", cleanedData);

      return await this.prisma.user.update({
        where: { id: userId },
        data: cleanedData,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string) {
    const user = await this.findById(userId);

    const totalQuizzes = await this.prisma.quizAttempt.count({
      where: { userId },
    });

    const averageScore = await this.prisma.quizAttempt.aggregate({
      where: { userId },
      _avg: {
        score: true,
      },
    });

    const totalBadges = await this.prisma.userBadge.count({
      where: { userId },
    });

    const totalStudySessions = await this.prisma.studySession.count({
      where: { userId },
    });

    return {
      user: this.sanitizeUser(user),
      stats: {
        points: user.points,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        studyRank: user.studyRank,
        totalStudyTime: user.totalStudyTime,
        totalQuizzes,
        averageScore: averageScore._avg.score || 0,
        totalBadges,
        totalStudySessions,
      },
    };
  }

  /**
   * Get user's enrolled courses
   */
  async getUserCourses(userId: string) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: {
        masteryPercentage: "desc",
      },
    });

    // Map to include course data with 'name' field for frontend compatibility
    return enrollments.map((enrollment) => ({
      ...enrollment.course,
      name: enrollment.course.title, // Add name field for frontend
      enrollment: {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.masteryPercentage,
      },
    }));
  }

  /**
   * Update user's study streak
   */
  async updateStreak(userId: string): Promise<void> {
    const user = await this.findById(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastStudyDate) {
      // First study session
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: new Date(),
        },
      });
      return;
    }

    const lastStudy = new Date(user.lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Already studied today
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      const newStreak = user.currentStreak + 1;
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, user.longestStreak),
          lastStudyDate: new Date(),
        },
      });
    } else {
      // Streak broken
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: 1,
          lastStudyDate: new Date(),
        },
      });
    }
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: User): Partial<User> {
    const {
      password,
      refreshToken,
      emailVerificationToken,
      passwordResetToken,
      ...sanitized
    } = user;
    return sanitized;
  }
}
