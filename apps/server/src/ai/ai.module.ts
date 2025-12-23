import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { GeminiService } from "./gemini.service";
import { PromptFactory } from "./prompt.factory";

@Module({
  controllers: [AiController],
  providers: [AiService, GeminiService, PromptFactory],
  exports: [AiService, GeminiService, PromptFactory],
})
export class AiModule {}
