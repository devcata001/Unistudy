import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuizDifficulty } from '@prisma/client';

export class CreateQuizDto {
  @ApiProperty({ example: 'Binary Trees Quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Test your knowledge of binary tree data structures', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'course-id-here' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ enum: QuizDifficulty, example: QuizDifficulty.MEDIUM })
  @IsEnum(QuizDifficulty)
  @IsOptional()
  difficulty?: QuizDifficulty;

  @ApiProperty({ example: 30, description: 'Time limit in minutes', required: false })
  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(180)
  timeLimit?: number;

  @ApiProperty({ example: 70, description: 'Passing score percentage' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  passingScore?: number;
}

export class GenerateQuizDto {
  @ApiProperty({ example: 'course-id-here' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: 10, description: 'Number of questions' })
  @IsNumber()
  @Min(1)
  @Max(50)
  numQuestions: number;

  @ApiProperty({ enum: QuizDifficulty, example: QuizDifficulty.MEDIUM })
  @IsEnum(QuizDifficulty)
  difficulty: QuizDifficulty;

  @ApiProperty({ example: ['material-id-1', 'material-id-2'], description: 'Material IDs to generate from', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  materialIds?: string[];
}

export class SubmitQuizDto {
  @ApiProperty({ example: { 'question-id-1': 'answer-id-1', 'question-id-2': 'answer-id-2' } })
  @IsNotEmpty()
  answers: Record<string, string>;
}

export class QuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  questionType?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ type: [Object] })
  @IsArray()
  answers: {
    answerText: string;
    isCorrect: boolean;
    order?: number;
  }[];
}

export class CreateQuizWithQuestionsDto extends CreateQuizDto {
  @ApiProperty({ type: [QuestionDto] })
  @IsArray()
  @IsNotEmpty()
  questions: QuestionDto[];
}
