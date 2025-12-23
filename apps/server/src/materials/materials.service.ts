import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.material.create({ data });
  }

  async findByCourse(courseId: string) {
    return this.prisma.material.findMany({
      where: { courseId },
      include: { uploadedBy: true },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.material.findMany({
      where: { uploadedById: userId },
      orderBy: { uploadedAt: "desc" },
    });
  }

  async createManual(
    userId: string,
    title: string,
    content: string,
    courseCode?: string
  ) {
    // Try to find course by code if provided
    let courseId: string | undefined;
    if (courseCode) {
      const course = await this.prisma.course.findFirst({
        where: { code: courseCode },
      });
      courseId = course?.id;
    }

    // If no course found or no code provided, create a default "General Studies" course
    if (!courseId) {
      const generalCourse = await this.prisma.course.findFirst({
        where: { code: "GENERAL" },
      });

      if (generalCourse) {
        courseId = generalCourse.id;
      } else {
        // Create general course if it doesn't exist
        const newGeneral = await this.prisma.course.create({
          data: {
            code: "GENERAL",
            title: "General Studies",
            description: "General study materials",
            department: "General",
            faculty: "General",
            level: "100",
          },
        });
        courseId = newGeneral.id;
      }
    }

    // For AI-generated manuals, we'll use placeholder values for required fields
    return this.prisma.material.create({
      data: {
        title,
        extractedText: content,
        type: "DOCUMENT",
        fileUrl: `ai-manual://${Date.now()}`, // Virtual URL for AI-generated content
        fileSize: Buffer.byteLength(content, "utf8"),
        mimeType: "text/html",
        uploadedById: userId,
        courseId,
        tags: courseCode
          ? ["AI-Generated", "Study Manual", courseCode]
          : ["AI-Generated", "Study Manual"],
      },
    });
  }
  async createFromUpload(
    userId: string,
    file: Express.Multer.File,
    title?: string,
    courseId?: string
  ) {
    const fileType = this.getFileType(file.mimetype);

    return this.prisma.material.create({
      data: {
        title: title || file.originalname,
        type: fileType,
        fileUrl: `/uploads/${file.filename}`,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedById: userId,
        courseId: courseId || "general",
        tags: ["Uploaded"],
      },
    });
  }

  private getFileType(mimeType: string): "PDF" | "IMAGE" | "DOCUMENT" | "TEXT" {
    if (mimeType === "application/pdf") return "PDF";
    if (mimeType.startsWith("image/")) return "IMAGE";
    if (mimeType.includes("word") || mimeType.includes("document"))
      return "DOCUMENT";
    return "TEXT";
  }
}
