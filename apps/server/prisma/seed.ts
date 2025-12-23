import { PrismaClient, AuthProvider, Role, StudyRank, MaterialType, QuizDifficulty, BadgeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (be careful in production!)
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.studyGroupMember.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.weakTopic.deleteMany();
  await prisma.material.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create Users
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@lautech.edu.ng',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      department: 'Computer Science',
      faculty: 'Faculty of Engineering',
      level: '400',
      points: 5000,
      currentStreak: 15,
      longestStreak: 30,
      studyRank: StudyRank.EXPERT,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'john.doe@lautech.edu.ng',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.STUDENT,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      department: 'Computer Science',
      faculty: 'Faculty of Engineering',
      level: '400',
      matricNumber: 'CSC/2020/001',
      points: 1250,
      currentStreak: 7,
      longestStreak: 12,
      studyRank: StudyRank.SCHOLAR,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'jane.smith@lautech.edu.ng',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: Role.STUDENT,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      department: 'Mathematics',
      faculty: 'Faculty of Pure and Applied Sciences',
      level: '300',
      matricNumber: 'MTH/2021/045',
      points: 890,
      currentStreak: 3,
      longestStreak: 8,
      studyRank: StudyRank.LEARNER,
    },
  });

  console.log('✅ Created users');

  // Create Courses
  const csc301 = await prisma.course.create({
    data: {
      code: 'CSC301',
      title: 'Data Structures & Algorithms',
      description: 'Introduction to data structures, algorithm analysis, and problem-solving techniques.',
      department: 'Computer Science',
      faculty: 'Faculty of Engineering',
      level: '300',
      semester: 'First Semester',
      creditUnits: 3,
    },
  });

  const csc302 = await prisma.course.create({
    data: {
      code: 'CSC302',
      title: 'Database Management Systems',
      description: 'Database design, SQL, normalization, and database administration.',
      department: 'Computer Science',
      faculty: 'Faculty of Engineering',
      level: '300',
      semester: 'Second Semester',
      creditUnits: 3,
    },
  });

  const mth201 = await prisma.course.create({
    data: {
      code: 'MTH201',
      title: 'Linear Algebra',
      description: 'Vector spaces, matrices, linear transformations, eigenvalues and eigenvectors.',
      department: 'Mathematics',
      faculty: 'Faculty of Pure and Applied Sciences',
      level: '200',
      semester: 'First Semester',
      creditUnits: 3,
    },
  });

  const mth202 = await prisma.course.create({
    data: {
      code: 'MTH202',
      title: 'Calculus II',
      description: 'Integration techniques, sequences and series, multivariable calculus.',
      department: 'Mathematics',
      faculty: 'Faculty of Pure and Applied Sciences',
      level: '200',
      semester: 'Second Semester',
      creditUnits: 4,
    },
  });

  console.log('✅ Created courses');

  // Create Course Enrollments
  await prisma.courseEnrollment.create({
    data: {
      userId: student1.id,
      courseId: csc301.id,
      masteryPercentage: 85,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student1.id,
      courseId: csc302.id,
      masteryPercentage: 72,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student2.id,
      courseId: mth201.id,
      masteryPercentage: 68,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student2.id,
      courseId: mth202.id,
      masteryPercentage: 55,
    },
  });

  console.log('✅ Created enrollments');

  // Create Sample Materials
  await prisma.material.create({
    data: {
      title: 'Introduction to Binary Trees',
      description: 'Comprehensive guide to binary tree data structures',
      type: MaterialType.PDF,
      fileUrl: '/uploads/binary-trees.pdf',
      fileSize: 2048000,
      mimeType: 'application/pdf',
      extractedText: 'Binary trees are hierarchical data structures...',
      courseId: csc301.id,
      uploadedById: student1.id,
      tags: ['data-structures', 'trees', 'algorithms'],
    },
  });

  await prisma.material.create({
    data: {
      title: 'SQL Query Basics',
      description: 'Introduction to SQL queries and database operations',
      type: MaterialType.TEXT,
      fileUrl: '/uploads/sql-basics.txt',
      fileSize: 512000,
      mimeType: 'text/plain',
      extractedText: 'SELECT, INSERT, UPDATE, DELETE operations...',
      courseId: csc302.id,
      uploadedById: student1.id,
      tags: ['sql', 'database', 'queries'],
    },
  });

  console.log('✅ Created materials');

  // Create Badges
  const badges = [
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day study streak',
      type: BadgeType.STREAK,
      icon: '🔥',
      requiredValue: 7,
    },
    {
      name: 'Quiz Master',
      description: 'Score 100% on any quiz',
      type: BadgeType.QUIZ_MASTER,
      icon: '🎯',
      requiredValue: 100,
    },
    {
      name: 'Early Bird',
      description: 'Study before 9 AM',
      type: BadgeType.EARLY_BIRD,
      icon: '🌅',
      requiredValue: 1,
    },
    {
      name: 'Night Owl',
      description: 'Study after 10 PM',
      type: BadgeType.NIGHT_OWL,
      icon: '🌙',
      requiredValue: 1,
    },
    {
      name: 'Study Warrior',
      description: 'Complete 50 study sessions',
      type: BadgeType.STUDY_WARRIOR,
      icon: '⚔️',
      requiredValue: 50,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
  }

  console.log('✅ Created badges');

  // Award a badge to student
  const weekWarriorBadge = await prisma.badge.findFirst({
    where: { type: BadgeType.STREAK },
  });

  if (weekWarriorBadge) {
    await prisma.userBadge.create({
      data: {
        userId: student1.id,
        badgeId: weekWarriorBadge.id,
      },
    });
  }

  console.log('✅ Awarded badges');

  // Create a Quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Binary Trees Quiz',
      description: 'Test your knowledge of binary tree data structures',
      courseId: csc301.id,
      difficulty: QuizDifficulty.MEDIUM,
      timeLimit: 30,
      passingScore: 70,
      isAutoGenerated: true,
      questions: {
        create: [
          {
            question: 'What is the maximum number of children a node can have in a binary tree?',
            questionType: 'multiple_choice',
            points: 1,
            order: 1,
            explanation: 'In a binary tree, each node can have at most 2 children.',
            answers: {
              create: [
                { answerText: '2', isCorrect: true, order: 1 },
                { answerText: '1', isCorrect: false, order: 2 },
                { answerText: '3', isCorrect: false, order: 3 },
                { answerText: 'Unlimited', isCorrect: false, order: 4 },
              ],
            },
          },
          {
            question: 'What is the time complexity of searching in a balanced binary search tree?',
            questionType: 'multiple_choice',
            points: 1,
            order: 2,
            explanation: 'In a balanced BST, search operations take O(log n) time.',
            answers: {
              create: [
                { answerText: 'O(log n)', isCorrect: true, order: 1 },
                { answerText: 'O(n)', isCorrect: false, order: 2 },
                { answerText: 'O(1)', isCorrect: false, order: 3 },
                { answerText: 'O(n²)', isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Created quiz');

  // Create Study Sessions
  await prisma.studySession.create({
    data: {
      userId: student1.id,
      courseId: csc301.id,
      duration: 45,
      pointsEarned: 180,
      activitiesCount: 5,
      sessionType: 'study',
      startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
  });

  await prisma.studySession.create({
    data: {
      userId: student1.id,
      courseId: csc301.id,
      duration: 30,
      pointsEarned: 120,
      activitiesCount: 3,
      sessionType: 'quiz',
    },
  });

  console.log('✅ Created study sessions');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Created:');
  console.log('   - 3 Users (1 admin, 2 students)');
  console.log('   - 4 Courses');
  console.log('   - 4 Course Enrollments');
  console.log('   - 2 Study Materials');
  console.log('   - 5 Badges');
  console.log('   - 1 Quiz with 2 Questions');
  console.log('   - 2 Study Sessions');
  console.log('\n🔐 Test Credentials:');
  console.log('   Admin: admin@lautech.edu.ng / Password123!');
  console.log('   Student 1: john.doe@lautech.edu.ng / Password123!');
  console.log('   Student 2: jane.smith@lautech.edu.ng / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
