import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateQuizWithQuestionsDto, GenerateQuizDto, SubmitQuizDto } from './dto/quiz.dto';

@ApiTags('quizzes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate quiz automatically from materials using AI' })
  @ApiResponse({ status: 201, description: 'Quiz generated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - no materials found or user not enrolled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateQuiz(
    @CurrentUser('id') userId: string,
    @Body() dto: GenerateQuizDto,
  ) {
    return this.quizzesService.generateQuiz(userId, dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create quiz manually' })
  @ApiResponse({ status: 201, description: 'Quiz created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createQuiz(@Body() dto: CreateQuizWithQuestionsDto) {
    return this.quizzesService.createQuiz(dto);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get all quizzes for a course' })
  @ApiResponse({ status: 200, description: 'Quizzes retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCourseQuizzes(@Param('courseId') courseId: string) {
    return this.quizzesService.getCourseQuizzes(courseId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get quiz history for current user' })
  @ApiResponse({ status: 200, description: 'Quiz history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getQuizHistory(
    @CurrentUser('id') userId: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.quizzesService.getQuizHistory(userId, courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID (for taking)' })
  @ApiResponse({ status: 200, description: 'Quiz retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  @ApiResponse({ status: 400, description: 'User not enrolled in course' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getQuiz(
    @Param('id') quizId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.quizzesService.getQuiz(quizId, userId);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit quiz answers' })
  @ApiResponse({ status: 200, description: 'Quiz submitted and scored successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async submitQuiz(
    @Param('id') quizId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizzesService.submitQuiz(quizId, userId, dto);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get quiz statistics' })
  @ApiResponse({ status: 200, description: 'Quiz stats retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getQuizStats(@Param('id') quizId: string) {
    return this.quizzesService.getQuizStats(quizId);
  }
}
