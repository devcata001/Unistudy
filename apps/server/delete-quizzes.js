const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllQuizzes() {
    try {
        console.log('Deleting all quiz attempts...');
        await prisma.quizAttempt.deleteMany();

        console.log('Deleting all quiz questions...');
        await prisma.quizQuestion.deleteMany();

        console.log('Deleting all quizzes...');
        await prisma.quiz.deleteMany();

        console.log('✅ All quizzes deleted successfully!');
    } catch (error) {
        console.error('Error deleting quizzes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteAllQuizzes();
