import {
  PrismaClient,
  AuthProvider,
  Role,
  StudyRank,
  MaterialType,
  QuizDifficulty,
  BadgeType,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

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

  console.log("✅ Cleaned existing data");

  // Create Users
  const hashedPassword = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@lautech.edu.ng",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: Role.ADMIN,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      department: "Computer Science",
      faculty: "Faculty of Engineering",
      level: "400",
      points: 5000,
      currentStreak: 15,
      longestStreak: 30,
      studyRank: StudyRank.EXPERT,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: "john.doe@lautech.edu.ng",
      password: hashedPassword,
      firstName: "John",
      lastName: "Doe",
      role: Role.STUDENT,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      department: "Computer Science",
      faculty: "Faculty of Engineering",
      level: "400",
      matricNumber: "CSC/2020/001",
      points: 1250,
      currentStreak: 7,
      longestStreak: 12,
      studyRank: StudyRank.SCHOLAR,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "jane.smith@lautech.edu.ng",
      password: hashedPassword,
      firstName: "Jane",
      lastName: "Smith",
      role: Role.STUDENT,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      department: "Mathematics",
      faculty: "Faculty of Pure and Applied Sciences",
      level: "300",
      matricNumber: "MTH/2021/045",
      points: 890,
      currentStreak: 3,
      longestStreak: 8,
      studyRank: StudyRank.LEARNER,
    },
  });

  console.log("✅ Created users");

  // Create 5 Essential 100-Level Courses (Only the 101s)
  const phy101 = await prisma.course.create({
    data: {
      code: "PHY101",
      title: "General Physics I",
      description:
        "Introduction to mechanics, units and dimensions, kinematics, Newton's laws of motion, work and energy, conservation laws.",
      department: "Physics",
      faculty: "Faculty of Science",
      level: "100",
      semester: "First Semester",
      creditUnits: 3,
    },
  });

  const chm101 = await prisma.course.create({
    data: {
      code: "CHM101",
      title: "General Chemistry I",
      description:
        "Atomic structure, periodic table, chemical bonding, states of matter, chemical reactions, stoichiometry, acids and bases.",
      department: "Chemistry",
      faculty: "Faculty of Science",
      level: "100",
      semester: "First Semester",
      creditUnits: 3,
    },
  });

  const bio101 = await prisma.course.create({
    data: {
      code: "BIO101",
      title: "General Biology I",
      description:
        "Cell biology, genetics, evolution, diversity of life, plant and animal structure and function.",
      department: "Biology",
      faculty: "Faculty of Science",
      level: "100",
      semester: "First Semester",
      creditUnits: 3,
    },
  });

  const mth101 = await prisma.course.create({
    data: {
      code: "MTH101",
      title: "General Mathematics I",
      description:
        "Elementary set theory, real numbers, algebra, trigonometry, polynomials, logarithms, binomial theorem.",
      department: "Mathematics",
      faculty: "Faculty of Science",
      level: "100",
      semester: "First Semester",
      creditUnits: 3,
    },
  });

  const gst101 = await prisma.course.create({
    data: {
      code: "GST101",
      title: "Use of English",
      description:
        "Communication skills in English, essay writing, comprehension, summary writing, oral communication.",
      department: "General Studies",
      faculty: "All Faculties",
      level: "100",
      semester: "First Semester",
      creditUnits: 2,
    },
  });

  console.log(
    "Created 5 essential courses (PHY101, CHM101, BIO101, MTH101, GST101)"
  );

  // Create Course Enrollments
  await prisma.courseEnrollment.create({
    data: {
      userId: student1.id,
      courseId: phy101.id,
      masteryPercentage: 85,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student1.id,
      courseId: mth101.id,
      masteryPercentage: 72,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student1.id,
      courseId: chm101.id,
      masteryPercentage: 68,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student2.id,
      courseId: mth101.id,
      masteryPercentage: 78,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student2.id,
      courseId: bio101.id,
      masteryPercentage: 82,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: student2.id,
      courseId: gst101.id,
      masteryPercentage: 91,
    },
  });

  console.log("✅ Created enrollments");

  // Create Sample Materials
  await prisma.material.create({
    data: {
      title: "Introduction to Mechanics",
      description: "Comprehensive notes on Newton's laws and motion",
      type: MaterialType.PDF,
      fileUrl: "/uploads/mechanics-notes.pdf",
      fileSize: 2048000,
      mimeType: "application/pdf",
      extractedText: "Newton's laws state that...",
      courseId: phy101.id,
      uploadedById: student1.id,
      tags: ["physics", "mechanics", "newton"],
    },
  });

  await prisma.material.create({
    data: {
      title: "Organic Chemistry Basics",
      description: "Introduction to carbon compounds and chemical bonding",
      type: MaterialType.TEXT,
      fileUrl: "/uploads/organic-chemistry.txt",
      fileSize: 512000,
      mimeType: "text/plain",
      extractedText: "Carbon compounds, bonding, and molecular structure...",
      courseId: chm101.id,
      uploadedById: student2.id,
      tags: ["chemistry", "organic", "bonding"],
    },
  });

  console.log("✅ Created materials");

  // Create Badges
  const badges = [
    {
      name: "Week Warrior",
      description: "Maintain a 7-day study streak",
      type: BadgeType.STREAK,
      icon: "🔥",
      requiredValue: 7,
    },
    {
      name: "Quiz Master",
      description: "Score 100% on any quiz",
      type: BadgeType.QUIZ_MASTER,
      icon: "🎯",
      requiredValue: 100,
    },
    {
      name: "Early Bird",
      description: "Study before 9 AM",
      type: BadgeType.EARLY_BIRD,
      icon: "🌅",
      requiredValue: 1,
    },
    {
      name: "Night Owl",
      description: "Study after 10 PM",
      type: BadgeType.NIGHT_OWL,
      icon: "🌙",
      requiredValue: 1,
    },
    {
      name: "Study Warrior",
      description: "Complete 50 study sessions",
      type: BadgeType.STUDY_WARRIOR,
      icon: "⚔️",
      requiredValue: 50,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
  }

  console.log("✅ Created badges");

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

  console.log("✅ Awarded badges");

  // Create a Quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "Physics Mechanics Quiz",
      description: "Test your knowledge of Newton's laws and motion",
      courseId: phy101.id,
      difficulty: QuizDifficulty.MEDIUM,
      timeLimit: 30,
      passingScore: 70,
      isAutoGenerated: true,
      questions: {
        create: [
          {
            question: "What is Newton's first law of motion?",
            questionType: "multiple_choice",
            points: 1,
            order: 1,
            explanation:
              "Newton's first law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
            answers: {
              create: [
                {
                  answerText:
                    "An object at rest stays at rest unless acted upon by force",
                  isCorrect: true,
                  order: 1,
                },
                {
                  answerText: "Force equals mass times acceleration",
                  isCorrect: false,
                  order: 2,
                },
                {
                  answerText: "Every action has an equal and opposite reaction",
                  isCorrect: false,
                  order: 3,
                },
                {
                  answerText: "Energy is conserved",
                  isCorrect: false,
                  order: 4,
                },
              ],
            },
          },
          {
            question:
              "What is the formula for force according to Newton's second law?",
            questionType: "multiple_choice",
            points: 1,
            order: 2,
            explanation:
              "Newton's second law states that Force = Mass × Acceleration (F = ma).",
            answers: {
              create: [
                { answerText: "F = ma", isCorrect: true, order: 1 },
                { answerText: "F = mv", isCorrect: false, order: 2 },
                { answerText: "F = m/a", isCorrect: false, order: 3 },
                { answerText: "F = a/m", isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created quiz");

  // Create Study Sessions
  await prisma.studySession.create({
    data: {
      userId: student1.id,
      courseId: phy101.id,
      duration: 45,
      pointsEarned: 180,
      activitiesCount: 5,
      sessionType: "study",
      startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
  });

  await prisma.studySession.create({
    data: {
      userId: student1.id,
      courseId: mth101.id,
      duration: 30,
      pointsEarned: 120,
      activitiesCount: 3,
      sessionType: "quiz",
    },
  });

  console.log("✅ Created study sessions");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Created:");
  console.log("   - 3 Users (1 admin, 2 students)");
  console.log("   - 5 Courses (PHY101, CHM101, BIO101, MTH101, GST101)");
  console.log("   - 6 Course Enrollments");
  console.log("   - 2 Study Materials");
  console.log("   - 5 Badges");
  console.log("   - 1 Quiz with 2 Questions");
  console.log("   - 2 Study Sessions");
  console.log("\n🔐 Test Credentials:");
  console.log("   Admin: admin@lautech.edu.ng / Password123!");
  console.log("   Student 1: john.doe@lautech.edu.ng / Password123!");
  console.log("   Student 2: jane.smith@lautech.edu.ng / Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
