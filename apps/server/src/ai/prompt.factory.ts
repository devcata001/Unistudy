import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptFactory {
  /**
   * Generate tutor prompt with context and conversation history
   */
  generateTutorPrompt(
    question: string,
    context: string,
    conversationHistory: string = ""
  ): string {
    if (!context || context.trim() === "") {
      // No materials provided - act as a general academic tutor
      const historySection = conversationHistory
        ? `\n\nPREVIOUS CONVERSATION:\n${conversationHistory}\n`
        : "";

      return `You are an expert AI tutor for Nigerian university students, specializing in all academic subjects.
${historySection}
STUDENT QUESTION:
${question}

INSTRUCTIONS:
1. Provide comprehensive, detailed explanations
2. Use clear, simple language with examples
3. Break down complex topics step-by-step
4. Include relevant formulas, definitions, or key concepts
5. Relate to Nigerian university curriculum and exam standards
6. If asked to generate study material for a course, create well-structured content
7. If there's previous conversation history, maintain context and continuity
8. CRITICAL: Output clean HTML format, NO MARKDOWN SYNTAX
   - Use <h2>, <h3> for headings (NOT # or ##)
   - Use <p> for paragraphs
   - Use <ul> and <li> for lists (NOT - or *)
   - Use <strong> for emphasis (NOT ** or *)
   - Use <code> for formulas/code (NOT backticks)
   - NO asterisks, hashtags, or other markdown symbols

Provide a professional, clean response ready for web display.

ANSWER:`;
    }

    const historySection = conversationHistory
      ? `\n\nPREVIOUS CONVERSATION:\n${conversationHistory}\n`
      : "";

    return `You are an AI tutor for Nigerian university students. Answer using the provided study materials.
${historySection}
STUDY MATERIALS:
${context}

STUDENT QUESTION:
${question}

INSTRUCTIONS:
1. Use the provided study materials as your primary source
2. Provide clear, step-by-step explanations
3. Use simple language first, then provide advanced details
4. Include examples when possible
5. Focus on helping students understand concepts for exams
6. If there's previous conversation history, maintain context and continuity
7. CRITICAL: Output clean HTML format, NO MARKDOWN SYNTAX
   - Use <h2>, <h3> for headings (NOT # or ##)
   - Use <p> for paragraphs
   - Use <ul> and <li> for lists (NOT - or *)
   - Use <strong> for emphasis (NOT ** or *)
   - Use <code> for formulas/code (NOT backticks)
   - NO asterisks, hashtags, or other markdown symbols

Provide a professional, clean response ready for web display.

ANSWER:`;
  }

  /**
   * Generate quiz generation prompt
   */
  generateQuizPrompt(
    content: string,
    difficulty: string,
    numQuestions: number
  ): string {
    // Check if this is a course-based generation (no materials)
    const isCourseBasedGeneration = content.includes(
      "You are creating a quiz for a Nigerian university course"
    );

    if (isCourseBasedGeneration) {
      // Content already includes comprehensive instructions
      return `${content}

OUTPUT FORMAT - Return ONLY a valid JSON array, NO markdown formatting, NO extra text:
[
  {
    "question": "Question text here",
    "answers": [
      { "text": "Answer option 1", "isCorrect": true },
      { "text": "Answer option 2", "isCorrect": false },
      { "text": "Answer option 3", "isCorrect": false },
      { "text": "Answer option 4", "isCorrect": false }
    ],
    "explanation": "Clear explanation of why the correct answer is right and how it relates to the course material"
  }
]

CRITICAL REQUIREMENTS:
- Output MUST be valid JSON only (no markdown code blocks, no backticks)
- Each question must have exactly 4 answer options
- Only ONE answer should have "isCorrect": true
- Questions should cover different topics within the course
- For ${difficulty} difficulty:
  ${difficulty === "easy" ? "- Focus on fundamental concepts, definitions, and basic understanding" : ""}
  ${difficulty === "medium" ? "- Include application of concepts, problem-solving, and analysis" : ""}
  ${difficulty === "hard" ? "- Require synthesis, critical thinking, and advanced problem-solving" : ""}
- Make questions realistic and exam-standard for Nigerian universities
- Vary question types: conceptual, computational, application-based, analytical
- Do NOT use markdown symbols (*, **, #, etc.) in questions or answers
- Explanations should be educational and reference specific course concepts`;
    }

    // Material-based generation
    return `Generate ${numQuestions} ${difficulty} multiple-choice questions based on this content.

CONTENT:
${content}

OUTPUT FORMAT - Return ONLY a valid JSON array, NO markdown formatting, NO extra text:
[
  {
    "question": "Question text here",
    "answers": [
      { "text": "Answer option 1", "isCorrect": true },
      { "text": "Answer option 2", "isCorrect": false },
      { "text": "Answer option 3", "isCorrect": false },
      { "text": "Answer option 4", "isCorrect": false }
    ],
    "explanation": "Clear explanation of why the correct answer is right"
  }
]

CRITICAL REQUIREMENTS:
- Output MUST be valid JSON only (no markdown code blocks, no backticks)
- Each question must have exactly 4 answer options
- Only ONE answer should have "isCorrect": true
- Questions should test understanding, not just memorization
- Use proper difficulty level: easy (basic recall), medium (application), hard (analysis/synthesis)
- Do NOT use markdown symbols (*, **, #, etc.) in questions or answers
- Explanations should be clear and educational`;
  }

  /**
   * Generate summary prompt
   */
  generateSummaryPrompt(content: string): string {
    return `Summarize this study material in a clear, concise way for university students:

${content}

Focus on key concepts, definitions, and important points.`;
  }
}
