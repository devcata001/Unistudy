import { Controller, Post, Body, UseGuards, Sse } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Observable } from "rxjs";

@ApiTags("ai")
@Controller("ai")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private aiService: AiService) {}

  @Post("ask")
  async askQuestion(
    @CurrentUser("id") userId: string,
    @Body()
    body: { question: string; materialIds: string[]; conversationId?: string }
  ) {
    return this.aiService.askTutor(
      userId,
      body.question,
      body.materialIds,
      body.conversationId
    );
  }

  @Sse("ask-stream")
  askQuestionStream(
    @CurrentUser("id") userId: string,
    @Body() body: { question: string; materialIds: string[] }
  ): Observable<MessageEvent> {
    return this.aiService.askTutorStream(
      userId,
      body.question,
      body.materialIds
    );
  }
}
