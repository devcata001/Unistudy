# 🚀 Quick Start Testing Guide

## ⚡ Fast Track to Testing Your Backend

This guide gets you from zero to testing in **under 10 minutes**.

---

## Step 1: Install Dependencies (2 min)

```bash
cd /home/catalyst/LautechStudyHub/apps/server
npm install
```

This installs all NestJS dependencies and resolves all lint errors.

---

## Step 2: Configure Environment (1 min)

```bash
# Copy environment template
cp ../../.env.example .env

# Edit .env file - REQUIRED fields:
nano .env
```

**Minimum configuration** for testing:
```env
# Database (use local PostgreSQL or Railway/Render free tier)
DATABASE_URL="postgresql://user:password@localhost:5432/lautech_study_hub"

# JWT Secret (generate any random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key"

# Google Gemini API Key (get free from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key"

# App Settings
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Email (OPTIONAL for testing - can skip for now)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
```

---

## Step 3: Setup Database (3 min)

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed with test data
npm run seed
```

**Test credentials** (from seed data):
- Email: `admin@lautech.edu.ng` / Password: `Password123!`
- Email: `john.doe@lautech.edu.ng` / Password: `Password123!`
- Email: `jane.smith@lautech.edu.ng` / Password: `Password123!`

---

## Step 4: Start Server (1 min)

```bash
npm run start:dev
```

Expected output:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] PrismaModule dependencies initialized
[Nest] LOG [RoutesResolver] AuthController {/auth}
[Nest] LOG [RoutesResolver] UsersController {/users}
...
[Nest] LOG [NestApplication] Nest application successfully started
[Nest] LOG Application is running on: http://localhost:3001
[Nest] LOG Swagger UI available at: http://localhost:3001/api/docs
```

---

## Step 5: Test API (3 min)

### Option A: Using Swagger UI (Recommended) 🎯

1. **Open browser**: http://localhost:3001/api/docs
2. **Test login**:
   - Find `POST /auth/login`
   - Click "Try it out"
   - Enter credentials:
     ```json
     {
       "email": "admin@lautech.edu.ng",
       "password": "Password123!"
     }
     ```
   - Click "Execute"
   - Copy the `accessToken` from response

3. **Authorize**:
   - Click "Authorize" button at top
   - Paste token in format: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"

4. **Test other endpoints**:
   - Try `GET /users/me` to get your profile
   - Try `GET /courses` to list courses
   - Try `POST /ai/ask` to chat with AI tutor
   - Try `POST /quizzes/generate` to generate a quiz

### Option B: Using cURL

```bash
# 1. Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lautech.edu.ng","password":"Password123!"}'

# Save the accessToken from response, then:

# 2. Get your profile
curl -X GET http://localhost:3001/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. List courses
curl -X GET http://localhost:3001/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Ask AI tutor
curl -X POST http://localhost:3001/ai/ask \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"What is calculus?","materialIds":[]}'
```

### Option C: Using Postman/Insomnia

Import this base URL: `http://localhost:3001`

1. Create "Login" request: `POST /auth/login`
2. Use response token for other requests
3. Add header: `Authorization: Bearer YOUR_TOKEN`

---

## 🎯 Quick Test Checklist

Test these key features:

### Authentication ✅
- [ ] `POST /auth/register` - Register new user
- [ ] `POST /auth/login` - Login
- [ ] `POST /auth/refresh` - Refresh token
- [ ] `GET /users/me` - Get profile

### Courses ✅
- [ ] `GET /courses` - List courses
- [ ] `GET /courses/:id` - Get course details
- [ ] `POST /courses/:id/enroll` - Enroll in course

### AI Tutor ✅
- [ ] `POST /ai/ask` - Ask AI a question
- [ ] Test with different questions
- [ ] Check conversation history

### Quizzes ✅
- [ ] `POST /quizzes/generate` - Generate quiz from AI
- [ ] `GET /quizzes/:id` - Get quiz for taking
- [ ] `POST /quizzes/:id/submit` - Submit answers
- [ ] `GET /quizzes/history` - View history

### Gamification ✅
- [ ] `GET /gamification/stats` - View your stats
- [ ] `GET /gamification/badges` - List all badges
- [ ] `GET /gamification/badges/me` - Your badges
- [ ] `POST /gamification/daily-bonus` - Claim bonus

### Leaderboard ✅
- [ ] `GET /leaderboard/global` - Global rankings
- [ ] `GET /leaderboard/ranks/me` - Your ranks

### Study Groups ✅
- [ ] `POST /study-groups` - Create group
- [ ] `GET /study-groups/my-groups` - Your groups
- [ ] `POST /study-groups/:id/join` - Join group

### Progress ✅
- [ ] `POST /progress/session/start` - Start study session
- [ ] `POST /progress/session/end/:id` - End session
- [ ] `GET /progress/analytics` - View analytics

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Run `npm install` in `apps/server` directory

### Issue: "Database connection error"
**Solution**: 
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npx prisma migrate dev`

### Issue: "JWT malformed"
**Solution**: 
- Make sure you're using correct token format: `Bearer YOUR_TOKEN`
- Token must be from recent login (expires in 15 min)

### Issue: "API key not valid" (Gemini)
**Solution**:
- Get free key from https://makersuite.google.com/app/apikey
- Add to .env as `GEMINI_API_KEY`

### Issue: Port 3001 already in use
**Solution**:
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or change port in .env
PORT=3002
```

---

## 📊 Expected Test Results

### Successful Login Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@lautech.edu.ng",
    "name": "Admin User",
    "role": "ADMIN",
    "points": 0,
    "rank": "BRONZE"
  }
}
```

### Successful AI Response:
```json
{
  "conversationId": "uuid",
  "response": "Calculus is a branch of mathematics...",
  "messageId": "uuid"
}
```

### Successful Quiz Generation:
```json
{
  "id": "uuid",
  "title": "Course Title - MEDIUM Quiz",
  "questions": [
    {
      "question": "What is...",
      "answers": [...],
      "explanation": "..."
    }
  ],
  "difficulty": "MEDIUM",
  "timeLimit": 20
}
```

---

## 🎓 Test Scenarios

### Scenario 1: New Student Journey
1. Register new account
2. Login
3. Browse courses
4. Enroll in course
5. View course materials
6. Ask AI tutor for help
7. Take a quiz
8. Check points and badges

### Scenario 2: Study Session
1. Login
2. Start study session
3. Study for a few minutes
4. End study session
5. Check progress analytics
6. View study streak

### Scenario 3: Competition
1. Login
2. Take multiple quizzes
3. Check leaderboard position
4. View badges earned
5. Compare with other students

---

## 📈 Performance Expectations

- **Login**: < 500ms
- **Get courses**: < 200ms
- **AI response**: 2-5 seconds (depends on Gemini API)
- **Quiz generation**: 5-10 seconds (AI processing)
- **Quiz submission**: < 500ms
- **Analytics**: < 1 second

---

## ✅ Success Criteria

Your backend is working correctly if:
- ✅ All auth endpoints work
- ✅ You can enroll in courses
- ✅ AI tutor responds intelligently
- ✅ Quizzes are generated and can be taken
- ✅ Points are awarded
- ✅ Leaderboard shows rankings
- ✅ Progress tracking works

---

## 🚀 Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Configure email service** (optional)
3. **Set up file upload** (AWS S3/Cloudinary)
4. **Configure Google OAuth**
5. **Start frontend development**

---

## 🆘 Need Help?

Check these resources:
1. **Full Documentation**: See BACKEND_COMPLETE.md
2. **API Documentation**: http://localhost:3001/api/docs
3. **Onboarding Guide**: See ONBOARDING.md
4. **Architecture Guide**: See docs/ARCHITECTURE.md

---

**Testing Time**: ~10 minutes  
**Expected Result**: ✅ Fully functional backend API

Happy testing! 🎉
