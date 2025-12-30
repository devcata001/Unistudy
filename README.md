# 🎓 LAUTECH Study Hub

> AI-Powered, Gamified Study Platform for LAUTECH Students

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.8-green)](https://www.prisma.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

LAUTECH Study Hub is a **production-grade**, AI-powered study platform designed specifically for Ladoke Akintola University of Technology (LAUTECH) students. It combines intelligent tutoring, gamification, and collaborative learning to create an engaging educational experience.

### Why LAUTECH Study Hub?

- **🤖 AI-Powered Tutoring**: Get instant help from an AI tutor trained on your study materials
- **📚 Smart Material Management**: Upload and organize PDFs, images, and documents
- **🎯 Adaptive Quizzes**: Auto-generated quizzes that adapt to your learning level
- **🏆 Gamification**: Earn points, badges, and compete on leaderboards
- **👥 Study Groups**: Collaborate with classmates in organized study groups
- **📊 Progress Tracking**: Detailed analytics on your learning journey
- **🔥 Daily Streaks**: Stay motivated with streak tracking

## ✨ Features

### Core Features

#### 🔐 Authentication & Authorization

- Email/password authentication with bcrypt hashing
- Google OAuth 2.0 integration
- JWT access & refresh tokens
- Email verification
- Password reset functionality
- Role-based access control (Student, Admin, Moderator)

#### 🎓 Course Management

- Browse available courses by department/faculty
- Enroll in courses
- Track mastery percentage per course
- Identify weak topics automatically
- Course-specific materials and quizzes

#### 📖 Study Materials

- Upload PDFs, images, text files, and documents
- Automatic text extraction and OCR
- Material categorization and tagging
- Search and filter materials
- Material summaries powered by AI

#### 🤖 AI Tutor

- Context-aware responses based on uploaded materials
- No hallucinations - answers only from your materials
- Simple → Advanced explanation style
- Conversation history
- Support for text and image queries
- LaTeX math rendering

#### 📝 Smart Quizzes

- Auto-generate quizzes from study materials
- Multiple difficulty levels (Easy, Medium, Hard)
- Multiple choice and short answer questions
- Instant grading and feedback
- Quiz history and performance analytics
- Adaptive difficulty based on performance

#### 🎮 Gamification System

- **Points (XP)**: Earn points for study activities
- **Study Streaks**: Daily streak tracking
- **Ranks**: Progress from Novice → Learner → Scholar → Expert → Master → Grandmaster
- **Badges**: Unlock achievements
  - 🔥 Week Warrior (7-day streak)
  - 🎯 Quiz Master (100% quiz score)
  - 🌅 Early Bird (study before 9 AM)
  - 🌙 Night Owl (study after 10 PM)
  - ⚔️ Study Warrior (10+ study sessions)
  - 🎓 Course Complete (100% mastery)

#### 🏆 Leaderboard

- Global rankings
- Department rankings
- Faculty rankings
- Weekly/monthly/all-time views
- Real-time updates

#### 👥 Study Groups

- Create public or private groups
- Invite code system
- Group admin roles
- Shared materials
- Member management
- Group activity tracking

#### 📊 Progress Tracking

- Study time analytics
- Mastery trends per course
- Session history
- Performance insights
- Visual charts and graphs

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **API Client**: Axios

### Backend

- **Framework**: NestJS 10
- **Language**: TypeScript
- **API**: REST
- **Authentication**: Passport.js + JWT
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler

### Database

- **Database**: PostgreSQL 15
- **ORM**: Prisma 5
- **Migrations**: Prisma Migrate
- **Seeding**: Prisma Seed

### AI & ML

- **Text Generation**: Google Gemini Pro
- **Vision/OCR**: Google Gemini Pro Vision
- **PDF Processing**: pdf-parse
- **Image Processing**: Sharp

### DevOps & Infrastructure

- **Version Control**: Git
- **Package Manager**: npm
- **Process Manager**: PM2 (recommended)
- **Caching**: Redis (optional)
- **Storage**: Local filesystem / AWS S3 / Google Cloud Storage
- **Email**: Nodemailer (SMTP)

## 📁 Project Structure

```
lautech-study-hub/
├── apps/
│   ├── web/                          # Next.js Frontend
│   │   ├── app/
│   │   │   ├── (auth)/              # Auth pages
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── verify-email/
│   │   │   └── dashboard/           # Protected dashboard
│   │   │       ├── page.tsx         # Overview
│   │   │       ├── courses/
│   │   │       ├── materials/
│   │   │       ├── ai-tutor/
│   │   │       ├── quizzes/
│   │   │       ├── study-groups/
│   │   │       ├── leaderboard/
│   │   │       └── progress/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── charts/              # Chart components
│   │   │   └── gamification/        # Badges, points, etc.
│   │   ├── lib/
│   │   │   ├── api.ts               # API client
│   │   │   └── auth.ts              # Auth helpers
│   │   ├── hooks/                   # Custom React hooks
│   │   └── styles/
│   │
│   └── server/                       # NestJS Backend
│       ├── src/
│       │   ├── auth/                # Authentication
│       │   │   ├── dto/
│       │   │   ├── guards/
│       │   │   ├── strategies/
│       │   │   └── decorators/
│       │   ├── users/               # User management
│       │   ├── courses/             # Course management
│       │   ├── materials/           # Material upload
│       │   ├── ai/                  # AI tutor & Gemini
│       │   │   ├── gemini.service.ts
│       │   │   └── prompt.factory.ts
│       │   ├── quizzes/             # Quiz generation & taking
│       │   ├── gamification/        # Points, badges, ranks
│       │   ├── leaderboard/         # Rankings
│       │   ├── study-groups/        # Group management
│       │   ├── progress/            # Analytics
│       │   ├── prisma/              # Prisma service
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── prisma/
│           └── schema.prisma        # Database schema
│
├── prisma/
│   └── schema.prisma                # Shared Prisma schema
│
├── docs/
│   ├── ARCHITECTURE.md              # System architecture
│   ├── AI_PROMPTS.md                # AI prompt templates
│   └── GAMIFICATION.md              # Gamification rules
│
├── .env.example                     # Environment variables template
├── .gitignore
├── package.json                     # Root package.json
└── README.md                        # This file
```

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: v15.0 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: Latest version ([Download](https://git-scm.com/downloads))

### Optional but Recommended

- **Redis**: For caching and leaderboard ([Download](https://redis.io/download))
- **Docker**: For containerized development ([Download](https://www.docker.com/))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/lautech-study-hub.git
cd lautech-study-hub
```

### 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd apps/server
npm install
cd ../..
```

Install frontend dependencies (when ready):

```bash
cd apps/web
npm install
cd ../..
```

## ⚙️ Configuration

### 1. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Database

Edit `.env` and update the database URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/lautech_study_hub?schema=public"
```

Replace:

- `username`: Your PostgreSQL username
- `password`: Your PostgreSQL password
- `localhost:5432`: Your PostgreSQL host and port
- `lautech_study_hub`: Your database name

### 3. Configure JWT Secrets

Generate secure secrets for JWT:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Update in `.env` with strong, distinct secrets (do NOT commit .env to git):

```env
# Example - replace with the output from the commands shown below
JWT_SECRET="<32+_byte_base64_secret>"
JWT_REFRESH_SECRET="<32+_byte_base64_secret_different_from_jwt>"
```

Generate secure secrets (example commands):

```bash
# Linux / macOS
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 4. Configure Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 5. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
6. Update `.env`:

```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 6. Configure SMTP (Optional - for emails)

Update `.env` with your SMTP settings:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

## 🗄️ Database Setup

### 1. Create Database

Create a PostgreSQL database:

```bash
# Using psql
createdb lautech_study_hub

# Or using SQL
psql -U postgres
CREATE DATABASE lautech_study_hub;
\q
```

### 2. Run Migrations

Generate Prisma Client and run migrations:

```bash
cd apps/server
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Seed Database (Optional)

Create sample data:

```bash
npm run prisma:seed
```

### 4. View Database (Optional)

Open Prisma Studio to view/edit data:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## 🎯 Running the Application

### Development Mode

#### Option 1: Run Both (Backend + Frontend)

From the root directory:

```bash
npm run dev
```

This starts:

- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:3000` (when created)

#### Option 2: Run Separately

**Backend only:**

```bash
cd apps/server
npm run start:dev
```

**Frontend only:**

```bash
cd apps/web
npm run dev
```

### Production Mode

#### Build the Applications

```bash
npm run build
```

#### Start the Applications

```bash
npm start
```

## 📚 API Documentation

Once the backend is running, access the Swagger API documentation:

**URL**: `http://localhost:3001/api/docs`

### Available Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

#### Users

- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/courses` - Get enrolled courses

#### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

#### Materials

- `GET /api/materials/course/:courseId` - Get course materials
- `POST /api/materials/upload` - Upload material

#### AI

- `POST /api/ai/ask` - Ask AI tutor a question

## 👨‍💻 Development

### Code Structure Guidelines

1. **Use TypeScript strictly** - No `any` types
2. **Follow NestJS conventions** - Modules, Controllers, Services
3. **Use Prisma for all database operations** - No raw SQL
4. **Validate all inputs** - Use class-validator DTOs
5. **Handle errors properly** - Use NestJS exception filters
6. **Write clean, documented code** - JSDoc comments for complex functions

### Adding a New Feature

1. Create the Prisma model in `schema.prisma`
2. Run `npx prisma migrate dev`
3. Create NestJS module, service, controller
4. Add DTOs with validation
5. Add guards for protected routes
6. Document with Swagger decorators
7. Test the endpoints

### Database Migrations

Create a new migration:

```bash
cd apps/server
npx prisma migrate dev --name your_migration_name
```

Reset database (caution: loses data):

```bash
npx prisma migrate reset
```

## 🚢 Deployment

### Backend Deployment

#### Option 1: Traditional Server (VPS)

1. **Setup server** (Ubuntu example):

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

2. **Clone and setup**:

```bash
git clone your-repo-url
cd lautech-study-hub
npm install
cd apps/server
npm install
npm run build
```

3. **Setup environment**:

```bash
cp .env.example .env
nano .env  # Edit with production values
```

4. **Run migrations**:

```bash
npx prisma generate
npx prisma migrate deploy
```

5. **Start with PM2**:

```bash
pm2 start dist/main.js --name lautech-api
pm2 save
pm2 startup
```

#### Option 2: Docker

```bash
# Build image
docker build -t lautech-api ./apps/server

# Run container
docker run -d -p 3001:3001 --env-file .env lautech-api
```

#### Option 3: Cloud Platforms

- **Heroku**: Use `Procfile`
- **Render**: Use `render.yaml`
- **Railway**: Connect Git repo
- **AWS**: Use Elastic Beanstalk or ECS
- **Google Cloud**: Use App Engine or Cloud Run

### Frontend Deployment

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **AWS Amplify**: Connect Git repo

### Environment Variables for Production

Ensure these are set:

```env
NODE_ENV=production
DATABASE_URL="your-production-db-url"
JWT_SECRET="secure-secret"
GEMINI_API_KEY="your-key"
CORS_ORIGIN="https://your-frontend-domain.com"
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Scripts Reference

### Root Scripts

```bash
npm run dev              # Run both backend and frontend
npm run build            # Build both applications
npm start                # Start both in production
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

### Backend Scripts

```bash
npm run start:dev        # Development mode with watch
npm run start:debug      # Debug mode
npm run start:prod       # Production mode
npm run build            # Build for production
npm run lint             # Lint code
npm run format           # Format code
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Team**: [Names]
- **Frontend Team**: [Names]
- **Design Team**: [Names]

## 🙏 Acknowledgments

- LAUTECH for inspiration
- Google for Gemini AI
- NestJS and Next.js communities
- All contributors and testers

## 📧 Support

For support, email: support@lautechstudyhub.com  
Or join our Discord: [Link]

## 🗺️ Roadmap

### Version 1.0 (Current)

- ✅ Authentication & Authorization
- ✅ Course Management
- ✅ Material Upload
- ✅ AI Tutor
- ✅ Quiz System
- ✅ Gamification
- ✅ Leaderboard

### Version 1.1 (Planned)

- [ ] Real-time chat in study groups
- [ ] Video call integration
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Advanced analytics
- [ ] AI-powered study recommendations

### Version 2.0 (Future)

- [ ] Virtual study rooms
- [ ] Live lecture streaming
- [ ] Peer-to-peer tutoring marketplace
- [ ] Integration with university LMS
- [ ] Multi-university support

---

Made with ❤️ for LAUTECH Students

⭐ **Star this repo if you find it helpful!** ⭐
