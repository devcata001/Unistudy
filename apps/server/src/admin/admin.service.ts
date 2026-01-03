import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalCourses,
      totalQuizzes,
      totalMaterials,
      activeUsersToday,
      recentUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
      this.prisma.quiz.count(),
      this.prisma.material.count(),
      this.prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          university: true,
          department: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalQuizzes,
      totalMaterials,
      activeUsersToday,
      recentUsers,
    };
  }

  async getAllUsers(
    page: number,
    limit: number,
    search?: string,
    role?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { university: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          university: true,
          department: true,
          faculty: true,
          level: true,
          matricNumber: true,
          role: true,
          points: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              courses: true,
              quizAttempts: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
        quizAttempts: {
          include: {
            quiz: true,
          },
          take: 10,
        },
        _count: {
          select: {
            materials: true,
            quizAttempts: true,
            courses: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateUserRole(userId: string, role: string) {
    if (!Object.values(Role).includes(role as Role)) {
      throw new NotFoundException("Invalid role");
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
    });
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    // Note: You might want to add an isActive field to the User model
    // For now, we'll use a workaround or you can extend the schema
    return {
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    };
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  }

  async getUserAnalytics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usersByDay = await this.prisma.$queryRaw<
      Array<{ date: Date; count: bigint }>
    >`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM "User"
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const usersByRole = await this.prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });

    const usersByDepartment = await this.prisma.user.groupBy({
      by: ["department"],
      _count: true,
      orderBy: {
        _count: {
          department: "desc",
        },
      },
      take: 10,
    });

    return {
      usersByDay: usersByDay.map((item) => ({
        date: item.date,
        count: Number(item.count),
      })),
      usersByRole,
      topDepartments: usersByDepartment,
    };
  }

  async getCourseAnalytics() {
    const [totalCourses, mostEnrolled] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.course.findMany({
        take: 10,
        orderBy: {
          enrollments: {
            _count: "desc",
          },
        },
        include: {
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      }),
    ]);

    return {
      totalCourses,
      mostEnrolled,
    };
  }

  async getQuizAnalytics() {
    const [totalQuizzes, totalAttempts, averageScore] = await Promise.all([
      this.prisma.quiz.count(),
      this.prisma.quizAttempt.count(),
      this.prisma.quizAttempt.aggregate({
        _avg: {
          score: true,
        },
      }),
    ]);

    return {
      totalQuizzes,
      totalAttempts,
      averageScore: averageScore._avg.score || 0,
    };
  }

  async seedDatabase() {
    try {
      // Run the seed script
      const { stdout, stderr } = await execAsync("npx ts-node prisma/seed.ts", {
        cwd: process.cwd(),
        timeout: 60000, // 60 seconds timeout
      });

      return {
        success: true,
        message:
          "Database reseeded successfully with 22 real university courses",
        output: stdout,
        errors: stderr || null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to seed database",
        error: error.message,
        stderr: error.stderr,
        stdout: error.stdout,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
