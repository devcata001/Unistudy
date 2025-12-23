import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllQuizzes() {
  try {
    console.log("Deleting all quizzes and related data...");

    // Delete in order due to foreign key constraints
    await prisma.answer.deleteMany({});
    console.log("✓ Quiz answers deleted");

    await prisma.question.deleteMany({});
    console.log("✓ Quiz questions deleted");

    await prisma.quizAttempt.deleteMany({});
    console.log("✓ Quiz attempts deleted");

    await prisma.quiz.deleteMany({});
    console.log("✓ Quizzes deleted");

    console.log("\n✅ All quizzes successfully deleted!");
  } catch (error) {
    console.error("Error deleting quizzes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllQuizzes();
