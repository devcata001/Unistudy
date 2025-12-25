import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Get tokens from localStorage
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Initialize tokens from localStorage on client side
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
}

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;

  // Persist to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;

  // Clear from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin API instance with separate auth
export const adminApiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for admin API to add admin token
adminApiClient.interceptors.request.use(
  (config) => {
    const adminToken =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      clearTokens();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  university?: string;
  department?: string;
  level?: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  university?: string;
  department?: string;
  level?: number;
  role?: string;
  points: number;
  studyStreak: number;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  department: string;
  level: number;
  imageUrl?: string;
  createdAt: string;
  _count?: {
    materials: number;
    enrollments: number;
  };
}

export interface EnrolledCourse extends Course {
  enrollment?: {
    enrolledAt: string;
    progress: number;
  };
  weakTopics?: Array<{
    topic: string;
    count: number;
  }>;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  type: "PDF" | "VIDEO" | "LINK" | "DOCUMENT" | "TEXT" | "IMAGE";
  content: string;
  extractedText?: string;
  fileUrl?: string;
  order: number;
  createdAt: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  difficulty: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  createdAt: string;
}

export interface QuizAnswer {
  id: string;
  answerText: string;
  isCorrect?: boolean;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
  questionType: string;
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string>; // questionId -> answerId
  score: number;
  passed: boolean;
  completedAt: string;
  quiz?: Quiz;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Auth API
export const authApi = {
  login: (data: LoginDto) => api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterDto) =>
    api.post<AuthResponse>("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get<User>("/auth/me"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),

  verifyEmail: (token: string) => api.post("/auth/verify-email", { token }),
};

// Users API
export const usersApi = {
  getProfile: () => api.get<User>("/users/profile"),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>("/users/profile", data),

  getStats: () =>
    api.get<{
      totalCourses: number;
      completedQuizzes: number;
      averageScore: number;
      studyTime: number;
      rank: string;
    }>("/users/stats"),

  getEnrolledCourses: () => api.get<EnrolledCourse[]>("/users/courses"),
};

// Courses API
export const coursesApi = {
  getAll: (params?: { department?: string; level?: number }) =>
    api.get<Course[]>("/courses", { params }),

  getById: (id: string) => api.get<Course>(`/courses/${id}`),

  enroll: (courseId: string) => api.post(`/courses/${courseId}/enroll`),

  create: (data: {
    code: string;
    name: string;
    description: string;
    department: string;
    level: number;
  }) => api.post<Course>("/courses", data),

  update: (
    id: string,
    data: {
      code?: string;
      name?: string;
      description?: string;
      department?: string;
      level?: number;
    }
  ) => api.put<Course>(`/courses/${id}`, data),

  delete: (id: string) => api.delete(`/courses/${id}`),
};

// Materials API
export const materialsApi = {
  getByCourse: (courseId: string) =>
    api.get<Material[]>(`/materials/course/${courseId}`),
  getUserMaterials: () => api.get<Material[]>("/materials/user"),
  saveManual: (title: string, content: string, courseCode?: string) =>
    api.post<Material>("/materials/manual", { title, content, courseCode }),
  uploadFile: (file: File, title?: string, courseId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (courseId) formData.append("courseId", courseId);
    return api.post<Material>("/materials/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// AI API
export const aiApi = {
  ask: (question: string, conversationId?: string) =>
    api.post<{ answer: string; conversationId: string }>("/ai/ask", {
      question,
      conversationId,
      materialIds: [],
    }),
};

// Quizzes API
export const quizzesApi = {
  generate: (courseId: string, difficulty: string, numQuestions: number) =>
    api.post<Quiz>("/quizzes/generate", { courseId, difficulty, numQuestions }),

  create: (data: {
    courseId: string;
    title: string;
    questions: QuizQuestion[];
    timeLimit?: number;
    passingScore: number;
  }) => api.post<Quiz>("/quizzes", data),

  getByCourse: (courseId: string) =>
    api.get<Quiz[]>(`/quizzes/course/${courseId}`),

  getById: (id: string) => api.get<Quiz>(`/quizzes/${id}`),

  submit: (quizId: string, answers: Record<string, string>) =>
    api.post<QuizSubmission>(`/quizzes/${quizId}/submit`, { answers }),

  getHistory: () => api.get<QuizSubmission[]>("/quizzes/history"),

  getStats: (quizId: string) =>
    api.get<{ averageScore: number; totalAttempts: number; passRate: number }>(
      `/quizzes/${quizId}/stats`
    ),
};

// Universities API
export interface University {
  name: string;
  type: "Federal" | "State" | "Private";
  state: string;
  established: number;
  acronym?: string;
}

export const universitiesApi = {
  getAll: (params?: { type?: string; state?: string; search?: string }) =>
    api.get<{ count: number; universities: University[] }>("/universities", {
      params,
    }),

  getStats: () =>
    api.get<{
      total: number;
      federal: number;
      state: number;
      private: number;
      states: number;
      byState: Record<string, number>;
    }>("/universities/stats"),
};

// Admin API
export const adminApi = {
  login: (username: string, password: string) =>
    api.post<{
      access_token: string;
      admin: { username: string; role: string };
    }>("/admin/login", { username, password }),

  changePassword: (oldPassword: string, newPassword: string) =>
    adminApiClient.post("/admin/change-password", { oldPassword, newPassword }),

  getDashboardStats: () =>
    adminApiClient.get<{
      totalUsers: number;
      totalCourses: number;
      totalQuizzes: number;
      totalMaterials: number;
      activeUsersToday: number;
      recentUsers: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        university: string | null;
        department: string | null;
        createdAt: string;
      }>;
    }>("/admin/dashboard/stats"),

  getAllUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) =>
    adminApiClient.get<{
      users: Array<any>;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/admin/users", { params }),

  getUserById: (id: string) => adminApiClient.get<any>(`/admin/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    adminApiClient.patch(`/admin/users/${id}/role`, { role }),

  updateUserStatus: (id: string, isActive: boolean) =>
    adminApiClient.patch(`/admin/users/${id}/status`, { isActive }),

  deleteUser: (id: string) => adminApiClient.delete(`/admin/users/${id}`),

  getUserAnalytics: () =>
    adminApiClient.get<{
      usersByDay: Array<{ date: string; count: number }>;
      usersByRole: Array<{ role: string; _count: number }>;
      topDepartments: Array<{ department: string; _count: number }>;
    }>("/admin/analytics/users"),

  getCourseAnalytics: () =>
    adminApiClient.get<{
      totalCourses: number;
      mostEnrolled: Array<any>;
    }>("/admin/analytics/courses"),

  getQuizAnalytics: () =>
    adminApiClient.get<{
      totalQuizzes: number;
      totalAttempts: number;
      averageScore: number;
    }>("/admin/analytics/quizzes"),
};
