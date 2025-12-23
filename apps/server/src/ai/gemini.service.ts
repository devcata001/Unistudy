import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY") || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async *generateTextStream(prompt: string): AsyncGenerator<string> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  }

  async generateFromImage(imageData: Buffer, prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const imagePart = {
      inlineData: {
        data: imageData.toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  }
}
