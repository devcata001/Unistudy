# 👨‍💻 Developer Onboarding Guide

Welcome to the LAUTECH Study Hub development team! This guide will get you productive quickly.

## Day 1: Setup & Understanding (4-6 hours)

### Morning: Setup Your Environment (2 hours)

#### 1. Install Prerequisites ✅
```bash
# Check versions
node --version    # Should be 18+
npm --version     # Should be 9+
psql --version    # Should be 15+
git --version     # Latest

# If missing, install from:
# Node.js: https://nodejs.org/
# PostgreSQL: https://www.postgresql.org/download/
```

#### 2. Clone and Setup ✅
```bash
# Clone repository
git clone [repository-url]
cd lautech-study-hub

# Run setup script
chmod +x setup.sh
./setup.sh

# Or manual setup
npm install
cd apps/server && npm install && cd ../..
cp .env.example .env
```

#### 3. Configure Environment ✅
Edit `.env` file:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/lautech_study_hub"
JWT_SECRET="[run: openssl rand -base64 32]"
JWT_REFRESH_SECRET="[run: openssl rand -base64 32]"
GEMINI_API_KEY="[get from https://makersuite.google.com/app/apikey]"
```

#### 4. Setup Database ✅
```bash
# Create database
createdb lautech_study_hub

# Run migrations
cd apps/server
npx prisma generate
npx prisma migrate dev --name init

# Add sample data
npm run prisma:seed

# Test database
npx prisma studio
# Opens at http://localhost:5555
```

#### 5. Start Development Server ✅
```bash
# From root directory
npm run dev:server

# Should see:
# 🚀 Server running on http://localhost:3001
# 📚 API Documentation: http://localhost:3001/api/docs
```

#### 6. Test the API ✅
Visit: http://localhost:3001/api/docs

Try:
1. Register a user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Get profile: `GET /api/auth/me` (use token from login)

### Afternoon: Explore the Codebase (2-3 hours)

#### 1. Read Documentation ✅
Priority order:
1. `README.md` - Overview and setup
2. `SUMMARY.md` - What's built
3. `docs/ARCHITECTURE.md` - System design
4. `docs/PROJECT_STATUS.md` - Current state

#### 2. Understand Database Schema ✅
Open: `prisma/schema.prisma`

Key models to understand:
- `User` - Authentication and gamification
- `Course` & `CourseEnrollment` - Course system
- `Material` - Study materials
- `Quiz`, `Question`, `Answer` - Quiz system
- `Badge`, `Achievement` - Gamification
- `AIConversation` - AI tutor

#### 3. Explore Code Structure ✅
```
apps/server/src/
├── auth/              # Start here - authentication
│   ├── auth.service.ts       # Business logic
│   ├── auth.controller.ts    # API endpoints
│   ├── guards/               # Security
│   └── strategies/           # JWT strategy
├── users/             # User management
├── courses/           # Course management
├── materials/         # File handling
├── ai/                # AI integration
│   ├── gemini.service.ts     # Google AI
│   └── prompt.factory.ts     # Prompt templates
├── prisma/            # Database service
└── main.ts            # Entry point
```

#### 4. Code Reading Exercise ✅
Read these files in order:
1. `main.ts` - App initialization
2. `app.module.ts` - Module structure
3. `auth/auth.service.ts` - Example service
4. `auth/auth.controller.ts` - Example controller
5. `ai/gemini.service.ts` - AI integration

Take notes on:
- How modules are organized
- How services work
- How DTOs are validated
- How errors are handled

### Evening: Make Your First Contribution (1-2 hours)

#### Choose Your Path:

**Path A: Backend Feature (Recommended)**
Implement the Quizzes module:
1. Create `apps/server/src/quizzes/quizzes.service.ts`
2. Add quiz generation from AI
3. Add quiz taking logic
4. Test endpoints

**Path B: Documentation**
Improve docs:
1. Add more API examples
2. Create troubleshooting guide
3. Add deployment checklist

**Path C: Testing**
Write tests:
1. Auth service tests
2. User service tests
3. API endpoint tests

## Week 1: Core Development (40 hours)

### Day 2-3: Complete Quiz Module (12-16 hours)

**Goal**: Fully functional quiz system

#### Tasks:
1. **Quiz Generation Service** (4 hours)
   - Use AI to generate questions from materials
   - Validate quiz structure
   - Save to database

2. **Quiz Taking Logic** (4 hours)
   - Get quiz with questions
   - Submit answers
   - Calculate score
   - Identify weak topics

3. **Quiz Analytics** (2 hours)
   - Quiz history
   - Performance tracking
   - Difficulty adaptation

4. **Testing** (2 hours)
   - Test all endpoints
   - Handle edge cases
   - Error scenarios

**Files to Create:**
- `quizzes/dto/quiz.dto.ts`
- `quizzes/quizzes.service.ts`
- `quizzes/quizzes.controller.ts`

**Reference:**
- Check existing modules for patterns
- Use `ai/gemini.service.ts` for AI calls
- Follow auth patterns for endpoints

### Day 4: Gamification Module (8 hours)

**Goal**: Points, badges, ranks working

#### Tasks:
1. **Points System** (2 hours)
   - Award points for activities
   - Calculate totals
   - Update user points

2. **Badge System** (3 hours)
   - Check badge requirements
   - Award badges
   - Track user badges

3. **Rank Progression** (2 hours)
   - Calculate rank from points
   - Update user rank
   - Rank thresholds

4. **Testing** (1 hour)

**Files to Create:**
- `gamification/gamification.service.ts`
- `gamification/gamification.controller.ts`

### Day 5: Leaderboard & Groups (8 hours)

**Morning: Leaderboard** (4 hours)
- Global rankings
- Department/faculty filters
- User position
- Real-time updates

**Afternoon: Study Groups** (4 hours)
- Create group
- Join/leave group
- Member management
- Group materials

## Week 2: Frontend Foundation (40 hours)

### Day 1: Setup Next.js (8 hours)

#### Morning: Project Setup (4 hours)
```bash
# Create Next.js app
cd apps
npx create-next-app@latest web --typescript --tailwind --app
cd web

# Install dependencies
npm install @tanstack/react-query axios
npm install framer-motion
npx shadcn-ui@latest init
```

#### Afternoon: Auth Pages (4 hours)
- Login page
- Register page
- Layout structure
- API client setup

### Day 2-3: Dashboard Layout (16 hours)
- Sidebar navigation
- Header with user menu
- Dashboard home page
- Routing setup
- Protected routes

### Day 4-5: Feature Pages (16 hours)
- Courses page
- Materials page
- AI Tutor interface
- Profile page

## Week 3: Polish & Deploy (40 hours)

### Testing (16 hours)
- Unit tests
- Integration tests
- E2E tests
- Bug fixes

### UI/UX Polish (16 hours)
- Animations
- Loading states
- Error handling
- Responsive design

### Deployment (8 hours)
- Setup production DB
- Deploy backend
- Deploy frontend
- Testing

## Daily Workflow

### Starting Your Day
```bash
# Update code
git pull origin main

# Start services
npm run dev:server

# In another terminal
npm run prisma:studio

# Check API docs
open http://localhost:3001/api/docs
```

### During Development
1. Create feature branch: `git checkout -b feature/your-feature`
2. Write code
3. Test locally
4. Commit often: `git commit -m "Clear message"`
5. Push: `git push origin feature/your-feature`
6. Create pull request

### Before Committing
```bash
# Format code
npm run format

# Lint
npm run lint

# Test (when available)
npm test

# Check types
cd apps/server && npm run build
```

## Coding Standards

### TypeScript
- ✅ Always use TypeScript, never `any`
- ✅ Define interfaces for all data structures
- ✅ Use strict mode
- ✅ Document complex functions with JSDoc

### NestJS
- ✅ One feature per module
- ✅ Services for business logic
- ✅ Controllers for HTTP handling
- ✅ DTOs for validation
- ✅ Guards for authorization
- ✅ Decorators for metadata

### Database
- ✅ All queries through Prisma
- ✅ No raw SQL
- ✅ Use transactions for multi-step operations
- ✅ Add indexes for frequently queried fields
- ✅ Create migrations for schema changes

### API Design
- ✅ RESTful conventions
- ✅ Proper HTTP status codes
- ✅ Consistent error responses
- ✅ Pagination for lists
- ✅ Filtering and sorting
- ✅ Swagger documentation

### Git
- ✅ Clear commit messages
- ✅ Small, focused commits
- ✅ Feature branches
- ✅ Pull requests for review
- ✅ Keep main branch stable

## Common Commands Cheatsheet

### Development
```bash
npm run dev                  # Start everything
npm run dev:server          # Backend only
npm run dev:web             # Frontend only
```

### Database
```bash
npm run prisma:studio       # GUI
npm run prisma:generate     # Generate client
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Add sample data
npx prisma migrate reset    # Reset DB (careful!)
```

### Code Quality
```bash
npm run lint                # Check code
npm run format              # Format code
npm test                    # Run tests
```

### Debugging
```bash
# Start in debug mode
cd apps/server
npm run start:debug

# Attach debugger to port 9229
```

## Resources

### Documentation
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Internal Docs
- `README.md` - Main docs
- `docs/ARCHITECTURE.md` - System design
- `docs/PROJECT_STATUS.md` - Current state
- `docs/QUICKSTART.md` - Quick setup

### Tools
- Swagger UI: http://localhost:3001/api/docs
- Prisma Studio: http://localhost:5555
- PostgreSQL: Use TablePlus or pgAdmin

## Getting Help

### Stuck on something?

1. **Check docs first**
   - Project docs in `/docs`
   - API docs at `/api/docs`
   - Code comments

2. **Debug systematically**
   - Read error messages
   - Check logs
   - Use debugger
   - Test in isolation

3. **Ask for help**
   - Team chat
   - Code review
   - Pair programming

### Common Issues

**"Cannot find module"**
→ Run `npm install` in correct directory

**"Prisma Client not generated"**
→ Run `npx prisma generate`

**"Database connection failed"**
→ Check DATABASE_URL in .env

**"Port already in use"**
→ Kill process: `lsof -ti:3001 | xargs kill -9`

## Success Checklist

After Week 1, you should be able to:
- [ ] Setup project from scratch
- [ ] Understand the codebase structure
- [ ] Read and understand existing code
- [ ] Create a new module
- [ ] Add API endpoints
- [ ] Write database queries
- [ ] Test endpoints with Swagger
- [ ] Make pull requests

After Week 2, you should be able to:
- [ ] Implement complete features
- [ ] Integrate AI functionality
- [ ] Handle errors properly
- [ ] Write clean, documented code
- [ ] Review others' code
- [ ] Debug complex issues

After Week 3, you should be able to:
- [ ] Design new features
- [ ] Make architecture decisions
- [ ] Deploy to production
- [ ] Mentor new developers

## Your First Week Goals

**Monday**: Environment setup, understand architecture
**Tuesday**: Read code, make first small contribution
**Wednesday**: Start implementing quiz module
**Thursday**: Complete quiz module, test thoroughly
**Friday**: Code review, documentation, planning

## Tips for Success

1. **Ask Questions Early** - Don't struggle alone
2. **Read Before Writing** - Understand existing patterns
3. **Test as You Go** - Don't wait until the end
4. **Document While Fresh** - Write docs as you code
5. **Review Others' Code** - Learn from the team
6. **Take Breaks** - Better quality, less bugs
7. **Celebrate Wins** - Track your progress

## Welcome to the Team! 🎉

You're joining an exciting project that will impact thousands of students. Your contributions matter!

**Ready to code?** Start with [QUICKSTART.md](docs/QUICKSTART.md)

**Questions?** Ask the team!

**Let's build something amazing!** 🚀
