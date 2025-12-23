import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { MaterialsService } from "./materials.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { diskStorage } from "multer";
import { extname } from "path";

@ApiTags("materials")
@Controller("materials")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get("course/:courseId")
  async getMaterialsByCourse(@Param("courseId") courseId: string) {
    return this.materialsService.findByCourse(courseId);
  }

  @Get("user")
  async getUserMaterials(@CurrentUser("id") userId: string) {
    return this.materialsService.findByUser(userId);
  }

  @Post("manual")
  async saveManual(
    @CurrentUser("id") userId: string,
    @Body() body: { title: string; content: string; courseCode?: string }
  ) {
    return this.materialsService.createManual(
      userId,
      body.title,
      body.content,
      body.courseCode
    );
  }

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    })
  )
  async uploadFile(
    @CurrentUser("id") userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title?: string; courseId?: string }
  ) {
    return this.materialsService.createFromUpload(
      userId,
      file,
      body.title,
      body.courseId
    );
  }
}
