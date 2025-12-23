import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CoursesService } from "./courses.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("courses")
@Controller("courses")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  async getAllCourses() {
    return this.coursesService.findAll();
  }

  @Get(":id")
  async getCourse(@Param("id") id: string) {
    return this.coursesService.findById(id);
  }

  @Post()
  async createCourse(
    @Body()
    dto: {
      code: string;
      name: string;
      description: string;
      department: string;
      level: number;
    }
  ) {
    return this.coursesService.create(dto);
  }

  @Post(":id/enroll")
  async enrollCourse(
    @CurrentUser("id") userId: string,
    @Param("id") courseId: string
  ) {
    return this.coursesService.enrollUser(userId, courseId);
  }

  @Put(":id")
  async updateCourse(
    @Param("id") id: string,
    @Body()
    dto: {
      code?: string;
      name?: string;
      description?: string;
      department?: string;
      level?: number;
    }
  ) {
    return this.coursesService.update(id, dto);
  }

  @Delete(":id")
  async deleteCourse(@Param("id") id: string) {
    return this.coursesService.delete(id);
  }
}
