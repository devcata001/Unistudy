# LAUTECH Study Hub - System Architecture

## Overview

LAUTECH Study Hub follows a modern, scalable **monorepo architecture** with clear separation between frontend and backend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js 14 (App Router)                 │   │
│  │  - React Components (shadcn/ui)                     │   │
│  │  - TanStack Query (State Management)                │   │
│  │  - Framer Motion (Animations)                       │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   NestJS Backend                     │   │
│  │  - REST Controllers                                  │   │
│  │  - JWT Authentication                                │   │
│  │  - Rate Limiting                                     │   │
│  │  - Request Validation                                │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
┌─────────────┐ ┌─────────┐ ┌──────────────┐
│   Business  │ │  Auth   │ │ Gamification │
│   Logic     │ │ Service │ │   Service    │
│   Services  │ └─────────┘ └──────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Prisma ORM (PostgreSQL)                 │   │
│  │  - Type-safe queries                                 │   │
│  │  - Migrations                                        │   │
│  │  - Connection pooling                                │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  PostgreSQL 15                       │   │
│  │  - User data                                         │   │
│  │  - Courses & Materials                               │   │
│  │  - Quiz data                                         │   │
│  │  - Gamification data                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

           External Services (Side Effects)
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Google     │  │    Redis     │  │    SMTP      │      │
│  │   Gemini AI  │  │   (Cache)    │  │   (Email)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Module Architecture

### Backend Modules

1. **Auth Module**
   - User registration and login
   - JWT token generation and validation
   - Google OAuth integration
   - Password reset and email verification

2. **Users Module**
   - User profile management
   - User statistics
   - Streak tracking

3. **Courses Module**
   - Course CRUD operations
   - Enrollment management
   - Mastery calculation

4. **Materials Module**
   - File upload (PDF, images, documents)
   - Text extraction and OCR
   - Material categorization

5. **AI Module**
   - Gemini AI integration
   - Prompt engineering
   - Context-aware tutoring
   - Response caching

6. **Quizzes Module**
   - Quiz generation from materials
   - Quiz taking and grading
   - Performance analytics

7. **Gamification Module**
   - Points calculation
   - Badge awarding
   - Rank progression
   - Achievement tracking

8. **Leaderboard Module**
   - Real-time rankings
   - Department/faculty filters
   - Caching with Redis

9. **Study Groups Module**
   - Group creation and management
   - Member permissions
   - Shared resources

10. **Progress Module**
    - Study session tracking
    - Analytics and insights
    - Time-based statistics

## Data Flow

### User Authentication Flow

```
1. User submits credentials
   ↓
2. NestJS Auth Controller receives request
   ↓
3. Auth Service validates credentials
   ↓
4. Password verified with bcrypt
   ↓
5. JWT tokens generated
   ↓
6. Tokens returned to client
   ↓
7. Client stores tokens (localStorage/cookies)
   ↓
8. Subsequent requests include JWT in Authorization header
   ↓
9. JWT Guard validates token on each request
```

### AI Tutor Flow

```
1. User asks question with material context
   ↓
2. Backend fetches selected materials from database
   ↓
3. Prompt Factory constructs context-aware prompt
   ↓
4. Gemini Service sends prompt to Google AI
   ↓
5. Response processed and validated
   ↓
6. Conversation saved to database
   ↓
7. Response returned to frontend
   ↓
8. Frontend renders with markdown/LaTeX support
```

### Quiz Generation Flow

```
1. User requests quiz for a course
   ↓
2. Backend retrieves course materials
   ↓
3. AI generates questions from content
   ↓
4. Questions validated and stored
   ↓
5. Quiz instance created
   ↓
6. User takes quiz
   ↓
7. Answers submitted and graded
   ↓
8. Points awarded, weak topics identified
   ↓
9. Results and analytics returned
```

## Security Architecture

### Authentication & Authorization

- **JWT Access Tokens**: Short-lived (15 minutes)
- **JWT Refresh Tokens**: Long-lived (7 days), stored in database
- **Password Hashing**: bcrypt with 12 salt rounds
- **Role-Based Access Control**: Guards check user roles

### API Security

- **Rate Limiting**: 100 requests per minute per IP
- **CORS**: Configured for specific origins
- **Input Validation**: All DTOs validated with class-validator
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Prevention**: Sanitized inputs and outputs

### Data Security

- **Sensitive Data**: Never exposed in API responses
- **Tokens**: Refresh tokens hashed in database
- **Environment Variables**: All secrets in .env
- **HTTPS**: Required in production

## Scalability Considerations

### Horizontal Scaling

- **Stateless API**: No session state in backend
- **Database Connection Pooling**: Prisma manages connections
- **Load Balancer Ready**: No server-side sessions

### Caching Strategy

- **Redis**: Optional for leaderboard and frequently accessed data
- **Query Caching**: Prisma query caching
- **CDN**: Static assets served via CDN

### Performance Optimization

- **Database Indexes**: On frequently queried fields
- **Lazy Loading**: Materials and large datasets paginated
- **Background Jobs**: Heavy processing offloaded (future)
- **Compression**: Response compression enabled

## Database Schema Design

### Key Relationships

```
User ──< CourseEnrollment >── Course
User ──< Material
User ──< QuizAttempt >── Quiz
User ──< StudySession
User ──< UserBadge >── Badge
User ──< UserAchievement >── Achievement
User ──< StudyGroupMember >── StudyGroup
Course ──< Material
Course ──< Quiz ──< Question ──< Answer
Course ──< WeakTopic
```

### Normalization

- **3NF Compliance**: Minimizes data redundancy
- **Foreign Key Constraints**: Data integrity enforced
- **Cascading Deletes**: Proper cleanup on deletions

## Error Handling

### Error Types

1. **Validation Errors**: 400 Bad Request
2. **Authentication Errors**: 401 Unauthorized
3. **Authorization Errors**: 403 Forbidden
4. **Not Found Errors**: 404 Not Found
5. **Conflict Errors**: 409 Conflict
6. **Server Errors**: 500 Internal Server Error

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [...]
}
```

## Logging & Monitoring

### Logging Strategy

- **Info**: Successful operations
- **Warn**: Recoverable errors
- **Error**: Critical failures
- **Debug**: Development only

### Monitoring Points

- API response times
- Database query performance
- AI API usage and costs
- Error rates
- User activity metrics

## Deployment Architecture

### Development Environment

```
Local Machine
  ├── Frontend (localhost:3000)
  ├── Backend (localhost:3001)
  └── PostgreSQL (localhost:5432)
```

### Production Environment

```
Load Balancer
  ├── Frontend Servers (CDN)
  ├── Backend Servers (Multiple instances)
  └── Database (Primary + Replicas)
```

## Technology Choices Justification

### Why NestJS?

- Enterprise-grade framework
- TypeScript native
- Excellent architecture patterns
- Built-in dependency injection
- Swagger integration

### Why Next.js?

- Server-side rendering
- Excellent developer experience
- Built-in routing
- API routes if needed
- Vercel deployment ready

### Why Prisma?

- Type-safe database client
- Excellent migration system
- Developer-friendly
- Great documentation
- Performance optimized

### Why PostgreSQL?

- Reliable and mature
- ACID compliance
- JSON support
- Full-text search
- Excellent for relational data

### Why Google Gemini?

- Multimodal capabilities
- Cost-effective
- Good performance
- Image understanding (OCR)
- Large context window

## Future Architecture Enhancements

### Phase 2

- Microservices architecture
- Message queue (RabbitMQ/Kafka)
- Separate AI service
- Redis cluster
- Elasticsearch for search

### Phase 3

- GraphQL API
- Real-time WebSockets
- Video streaming service
- Mobile API gateway
- Multi-region deployment
