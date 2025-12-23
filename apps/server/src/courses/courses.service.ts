import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const courses = await this.prisma.course.findMany({
      orderBy: { code: "asc" },
    });

    // Add 'name' field for frontend compatibility
    return courses.map((course) => ({
      ...course,
      name: course.title,
    }));
  }

  async create(dto: {
    code: string;
    name: string;
    description: string;
    department: string;
    level: number;
  }) {
    // Map department to faculty (simplified mapping)
    const facultyMap: Record<string, string> = {
      "Computer Science": "Science",
      "Computer Engineering": "Engineering",
      "Electrical Engineering": "Engineering",
      "Mechanical Engineering": "Engineering",
      "Civil Engineering": "Engineering",
      "Chemical Engineering": "Engineering",
      "Agricultural Engineering": "Engineering",
      Mathematics: "Science",
      Physics: "Science",
      Chemistry: "Science",
      Biology: "Science",
      Microbiology: "Science",
      Biochemistry: "Science",
      Nursing: "Clinical Sciences",
      "Medicine and Surgery": "Basic Medical Sciences",
      "Medical Laboratory Science (MLS)": "Basic Medical Sciences",
      Anatomy: "Basic Medical Sciences",
      Physiology: "Basic Medical Sciences",
      Pharmacology: "Basic Medical Sciences",
      "Cyber Security": "Science",
      "Information Technology": "Science",
      "Industrial Chemistry": "Science",
      "Pure and Applied Chemistry": "Science",
    };

    const faculty = facultyMap[dto.department] || "Science";

    return this.prisma.course.create({
      data: {
        code: dto.code,
        title: dto.name,
        description: dto.description,
        department: dto.department,
        faculty: faculty,
        level: dto.level.toString(),
      },
    });
  }

  async findById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        materials: true,
        quizzes: true,
        weakTopics: true,
      },
    });
  }

  async enrollUser(userId: string, courseId: string) {
    return this.prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  async updateMastery(enrollmentId: string, masteryPercentage: number) {
    return this.prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: { masteryPercentage },
    });
  }

  async update(
    id: string,
    dto: {
      code?: string;
      name?: string;
      description?: string;
      department?: string;
      level?: number;
    }
  ) {
    const updateData: any = {};

    if (dto.code) updateData.code = dto.code;
    if (dto.name) updateData.title = dto.name;
    if (dto.description) updateData.description = dto.description;
    if (dto.department) {
      updateData.department = dto.department;
      // Update faculty based on department
      const facultyMap: Record<string, string> = {
        "Computer Science": "Science",
        "Computer Engineering": "Engineering",
        "Electrical Engineering": "Engineering",
        "Mechanical Engineering": "Engineering",
        "Civil Engineering": "Engineering",
        "Chemical Engineering": "Engineering",
        "Agricultural Engineering": "Engineering",
        Mathematics: "Science",
        Physics: "Science",
        Chemistry: "Science",
        Biology: "Science",
        Microbiology: "Science",
        Biochemistry: "Science",
        Nursing: "Clinical Sciences",
        "Medicine and Surgery": "Basic Medical Sciences",
        "Medical Laboratory Science (MLS)": "Basic Medical Sciences",
        Anatomy: "Basic Medical Sciences",
        Physiology: "Basic Medical Sciences",
        Pharmacology: "Basic Medical Sciences",
        "Cyber Security": "Science",
        "Information Technology": "Science",
        "Industrial Chemistry": "Science",
        "Pure and Applied Chemistry": "Science",
      };
      updateData.faculty = facultyMap[dto.department] || "Science";
    }
    if (dto.level) updateData.level = dto.level.toString();

    const course = await this.prisma.course.update({
      where: { id },
      data: updateData,
    });

    return {
      ...course,
      name: course.title,
    };
  }

  async delete(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
