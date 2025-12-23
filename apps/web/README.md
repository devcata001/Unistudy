# LAUTECH Study Hub - Frontend

Modern, AI-powered study platform frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: TanStack Query (React Query)
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 🎨 Design

- Dark theme optimized for extended study sessions
- Cyan (#22D3EE) accent color matching the design mockups
- Responsive layout with mobile-first approach
- Smooth animations and transitions

## 📁 Project Structure

```
apps/web/
├── app/
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── dashboard/           # Protected dashboard pages
│   │   ├── courses/         # Course browsing and management
│   │   ├── materials/       # Study materials viewer
│   │   ├── ai-tutor/        # AI chat interface
│   │   ├── quizzes/         # Quiz system
│   │   └── layout.tsx       # Dashboard layout with sidebar
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
│
├── components/
│   ├── ui/                  # Reusable UI components (shadcn)
│   └── layout/              # Layout components (Sidebar, Navbar)
│
├── lib/
│   ├── api.ts              # API client and type definitions
│   └── utils.ts            # Utility functions
│
├── hooks/
│   └── useAuth.ts          # Authentication hook
│
├── providers/
│   └── QueryProvider.tsx   # TanStack Query provider
│
└── middleware.ts           # Route protection middleware
```

## 🔐 Authentication

- JWT-based authentication via HTTP-only cookies
- Automatic token refresh
- Protected routes using Next.js middleware
- Redirect logic for authenticated/unauthenticated users

## 🎯 Features Implemented

### ✅ Authentication Pages

- **Login**: Email/password authentication
- **Register**: User registration with department and level selection
- Forgot Password (UI ready)
- Email Verification (UI ready)

### ✅ Dashboard

- **Home**: Personalized dashboard with:
  - Daily goal progress
  - Points and streak tracking
  - Quick actions (Upload, AI Tutor, Quiz)
  - Enrolled courses overview
  - Weak topics identification

### ✅ Courses

- Browse all available courses
- View enrolled courses
- Course enrollment
- Filter and search functionality
- Progress tracking per course

### ✅ Study Materials

- View materials by course
- Support for PDFs, videos, and links
- Material type indicators
- Download/view functionality

### ✅ AI Tutor

- Real-time chat interface
- AI-powered responses using Gemini
- Context-aware assistance
- Clean message bubbles UI

### ✅ Smart Quizzes

- AI-generated quiz creation
- Topic and difficulty selection
- Quiz history with pass/fail status
- Score tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Backend server running on port 3001

### Installation

```bash
cd apps/web
npm install
```

### Development

```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## 🔗 API Integration

The frontend connects to the backend API at:

- **Development**: http://localhost:3001
- **Environment**: Configured via `.env.local`

### API Endpoints Used

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me

// Courses
GET  /api/courses
GET  /api/courses/:id
POST /api/courses/:id/enroll

// Materials
GET  /api/materials/course/:courseId

// AI
POST /api/ai/ask

// Quizzes
POST /api/quizzes/generate
GET  /api/quizzes/history
POST /api/quizzes/:id/submit
```

## 🎨 Customization

### Colors

Primary color scheme is defined in `tailwind.config.ts`:

- Primary: Cyan (#22D3EE)
- Background: Dark navy (#0A1628)
- Card: Dark blue (#1A2332)

### Components

All UI components are in `components/ui/` and can be customized using Tailwind classes.

## 📝 TypeScript

Strict type checking is enabled. All API responses are typed in `lib/api.ts`.

## 🔒 Security

- No tokens in localStorage (HTTP-only cookies)
- CSRF protection via same-origin policy
- Protected routes via middleware
- XSS protection through React's built-in escaping

## 🐛 Known Limitations

Some features show placeholder data (Points, Streaks) since backend modules are not yet implemented:

- Progress Tracker (backend module deleted)
- Study Groups (backend module deleted)
- Gamification/Leaderboard (backend module deleted)

These are marked as "Soon" in the sidebar navigation.

## 📚 Documentation

- Next.js: https://nextjs.org/docs
- TanStack Query: https://tanstack.com/query/latest
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com/docs
