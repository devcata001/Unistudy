'use client'

import { useAuth } from '@/hooks/useAuth'
import { useCourseCheck } from '@/hooks/useCourseCheck'
import { useQuery } from '@tanstack/react-query'
import { materialsApi, usersApi, quizzesApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseRegistrationModal } from '@/components/CourseRegistrationModal'
import OnboardingGuide from '@/components/OnboardingGuide'
import {
    Upload,
    Bot,
    FileText,
    Sparkles,
    BookOpen,
    Trophy,
    Clock,
    TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
    const { user } = useAuth()
    const { hasCourses, courseCount } = useCourseCheck()
    const [showCourseModal, setShowCourseModal] = useState(false)

    const [studyTime, setStudyTime] = useState(0)

    // Show modal on first visit if no courses
    useEffect(() => {
        const hasSeenModal = localStorage.getItem('hasSeenCourseModal')
        if (!hasCourses && !hasSeenModal && user) {
            setTimeout(() => setShowCourseModal(true), 2000) // Show after 2 seconds
            localStorage.setItem('hasSeenCourseModal', 'true')
        }
    }, [hasCourses, user])

    const { data: materials } = useQuery({
        queryKey: ['materials', 'user'],
        queryFn: async () => {
            const response = await materialsApi.getUserMaterials()
            return response.data
        },
    })

    const { data: enrolledCourses } = useQuery({
        queryKey: ['user', 'courses'],
        queryFn: async () => {
            const response = await usersApi.getEnrolledCourses()
            return response.data
        },
    })

    const { data: quizHistory } = useQuery({
        queryKey: ['quizzes', 'history'],
        queryFn: async () => {
            const response = await quizzesApi.getHistory()
            return response.data
        },
    })

    useEffect(() => {
        const saved = localStorage.getItem('studyStats')
        if (saved) {
            const parsed = JSON.parse(saved)
            setStudyTime(parsed.studyTime || 0)
        }

        const interval = setInterval(() => {
            setStudyTime(prev => {
                const newTime = prev + 1
                localStorage.setItem('studyStats', JSON.stringify({ studyTime: newTime }))
                return newTime
            })
        }, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [])

    const recentQuizzes = quizHistory?.slice(0, 3) || []
    const avgScore = quizHistory?.length
        ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length)
        : 0

    return (
        <>
            <CourseRegistrationModal
                isOpen={showCourseModal}
                onClose={() => setShowCourseModal(false)}
                courseCount={courseCount}
            />

            <OnboardingGuide user={user} hasCourses={hasCourses} />

            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Your personal study space for learning and growing.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/dashboard/materials">
                            <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="p-3 rounded-full bg-cyan-400/10 mb-3">
                                        <Upload className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h3 className="font-semibold">Upload Materials</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        PDFs, images, documents
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dashboard/generate-manual">
                            <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="p-3 rounded-full bg-cyan-400/10 mb-3">
                                        <Sparkles className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h3 className="font-semibold">Generate Manual</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        AI study materials
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dashboard/ai-tutor">
                            <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="p-3 rounded-full bg-cyan-400/10 mb-3">
                                        <Bot className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h3 className="font-semibold">AI Tutor</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Ask questions
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dashboard/flashcards">
                            <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="p-3 rounded-full bg-cyan-400/10 mb-3">
                                        <FileText className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h3 className="font-semibold">Flashcards</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Generate & study
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Study Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Study Materials</p>
                                        <p className="text-3xl font-bold text-cyan-400 mt-2">{materials?.length || 0}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-cyan-400/20" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                                        <p className="text-3xl font-bold text-cyan-400 mt-2">{enrolledCourses?.length || 0}</p>
                                    </div>
                                    <BookOpen className="h-8 w-8 text-cyan-400/20" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                                        <p className="text-3xl font-bold text-cyan-400 mt-2">{quizHistory?.length || 0}</p>
                                    </div>
                                    <Trophy className="h-8 w-8 text-cyan-400/20" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Average Score</p>
                                        <p className="text-3xl font-bold text-cyan-400 mt-2">{avgScore}%</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-cyan-400/20" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Recent Quiz Results</h2>
                    {recentQuizzes.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    No quiz attempts yet. Start learning!
                                </p>
                                <Link href="/dashboard/quizzes">
                                    <button className="mt-4 px-4 py-2 bg-cyan-400 text-background rounded-lg hover:bg-cyan-500 transition-colors">
                                        Take Your First Quiz
                                    </button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recentQuizzes.map((quiz) => (
                                <Card key={quiz.id} className={quiz.passed ? 'border-green-500/20' : 'border-red-500/20'}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{quiz.quiz?.title || 'Quiz'}</h3>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(quiz.completedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={`text-2xl font-bold ${quiz.passed ? 'text-green-500' : 'text-red-500'}`}>
                                                {quiz.score}%
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            {quiz.passed ? (
                                                <span className="text-green-500 flex items-center gap-1">
                                                    <Trophy className="h-4 w-4" />
                                                    Passed
                                                </span>
                                            ) : (
                                                <span className="text-red-500">Failed</span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
