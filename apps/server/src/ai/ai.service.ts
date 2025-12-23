import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GeminiService } from "./gemini.service";
import { PromptFactory } from "./prompt.factory";
import { Observable } from "rxjs";

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
    private promptFactory: PromptFactory
  ) {}

  async askTutor(
    userId: string,
    question: string,
    materialIds: string[],
    conversationId?: string
  ) {
    // Fetch materials for context
    const materials = await this.prisma.material.findMany({
      where: { id: { in: materialIds } },
    });

    const context = materials.map((m) => m.extractedText).join("\n\n");

    // Fetch conversation history if conversationId is provided
    let conversationHistory = "";
    let existingConversation: any = null;

    if (conversationId) {
      existingConversation = await this.prisma.aIConversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (existingConversation) {
        conversationHistory = existingConversation.messages
          .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n\n");
      }
    }

    const prompt = this.promptFactory.generateTutorPrompt(
      question,
      context,
      conversationHistory
    );
    const answer = await this.gemini.generateText(prompt);

    // Save or update conversation
    if (existingConversation) {
      // Add new messages to existing conversation
      await this.prisma.aIMessage.createMany({
        data: [
          {
            conversationId: existingConversation.id,
            role: "user",
            content: question,
          },
          {
            conversationId: existingConversation.id,
            role: "assistant",
            content: answer,
            model: "gemini-2.5-flash",
          },
        ],
      });

      return { answer, conversationId: existingConversation.id };
    } else {
      // Create new conversation
      const conversation = await this.prisma.aIConversation.create({
        data: {
          userId,
          materialIds,
          messages: {
            create: [
              { role: "user", content: question },
              {
                role: "assistant",
                content: answer,
                model: "gemini-2.5-flash",
              },
            ],
          },
        },
      });

      return { answer, conversationId: conversation.id };
    }
  }

  askTutorStream(
    userId: string,
    question: string,
    materialIds: string[]
  ): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      (async () => {
        try {
          // Fetch materials for context
          const materials = await this.prisma.material.findMany({
            where: { id: { in: materialIds } },
          });

          const context = materials.map((m) => m.extractedText).join("\n\n");
          const prompt = this.promptFactory.generateTutorPrompt(
            question,
            context
          );

          let fullAnswer = "";

          // Stream the response
          for await (const chunk of this.gemini.generateTextStream(prompt)) {
            fullAnswer += chunk;
            subscriber.next({ data: { chunk, done: false } } as any);
          }

          // Save conversation after streaming is complete
          await this.prisma.aIConversation.create({
            data: {
              userId,
              materialIds,
              messages: {
                create: [
                  { role: "user", content: question },
                  {
                    role: "assistant",
                    content: fullAnswer,
                    model: "gemini-2.5-flash",
                  },
                ],
              },
            },
          });

          subscriber.next({ data: { chunk: "", done: true } } as any);
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }
}
