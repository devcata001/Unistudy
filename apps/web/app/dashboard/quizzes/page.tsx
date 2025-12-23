'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { quizzesApi, usersApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trophy, Clock, CheckCircle, XCircle, Sparkles, ArrowRight } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export default function QuizzesPage() {
    const queryClient = useQueryClient()
    const [selectedCourseId, setSelectedCourseId] = useState<string>('')
    const [showGenerator, setShowGenerator] = useState(false)
    const [generatorData, setGeneratorData] = useState({
        difficulty: 'MEDIUM',
        count: 5,
    })

    const { data: enrolledCourses, isLoading: loadingCourses } = useQuery({
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

    const { data: availableQuizzes } = useQuery({
        queryKey: ['quizzes', 'course', selectedCourseId],
        queryFn: async () => {
            if (!selectedCourseId) return []
            const response = await quizzesApi.getByCourse(selectedCourseId)
            return response.data
        },
        enabled: !!selectedCourseId,
    })

    const generateMutation = useMutation({
        mutationFn: () =>
            quizzesApi.generate(
                selectedCourseId,
                generatorData.difficulty,
                generatorData.count
            ),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] })
            queryClient.invalidateQueries({ queryKey: ['user', 'courses'] })
            setShowGenerator(false)
            setGeneratorData({ difficulty: 'MEDIUM', count: 5 })
            // Redirect to the newly generated quiz
            window.location.href = `/dashboard/quizzes/${response.data.id}`
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || 'Failed to generate quiz. Please try again.'
            console.error('Quiz generation error:', message)
        },
    })

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCourseId) return
        generateMutation.mutate()
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Smart Quizzes</h1>
                <p className="text-muted-foreground mt-1">
                    Test your knowledge with AI-generated quizzes
                </p>
            </div>

            {/* Generate Quiz Card */}
            <Card className="bg-gradient-to-br from-cyan-400/10 to-card border-cyan-400/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-cyan-400" />
                        Generate AI Quiz
                    </CardTitle>
                    <CardDescription>
                        Create a custom quiz on any topic from your courses using AI. Quizzes are generated based on course materials if available, or course topics otherwise.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingCourses ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
                            <p className="text-sm text-muted-foreground mt-2">Loading...</p>
                        </div>
                    ) : !enrolledCourses || enrolledCourses.length === 0 ? (
                        <div className="text-center py-8">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">No Courses Enrolled</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You need to enroll in courses before generating quizzes
                            </p>
                            <Link href="/dashboard/courses">
                                <Button>
                                    Browse Courses
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    ) : !showGenerator ? (
                        <Button onClick={() => setShowGenerator(true)}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate New Quiz
                        </Button>
                    ) : (
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Course</label>
                                <select
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="">Choose a course</option>
                                    {enrolledCourses?.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} - {course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Difficulty</label>
                                    <select
                                        value={generatorData.difficulty}
                                        onChange={(e) =>
                                            setGeneratorData({ ...generatorData, difficulty: e.target.value })
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Number of Questions</label>
                                    <Input
                                        type="number"
                                        min="3"
                                        max="20"
                                        value={generatorData.count}
                                        onChange={(e) =>
                                            setGeneratorData({ ...generatorData, count: parseInt(e.target.value) })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={generateMutation.isPending}>
                                    {generateMutation.isPending ? 'Generating...' : 'Generate Quiz'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowGenerator(false)
                                        setGeneratorData({ difficulty: 'MEDIUM', count: 5 })
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            {/* Available Quizzes */}
            {availableQuizzes && availableQuizzes.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableQuizzes.map((quiz) => (
                            <Card key={quiz.id}>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <span>{quiz.questions?.length || 0} questions</span>
                                        {quiz.timeLimit && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {quiz.timeLimit} min
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <Link href={`/dashboard/quizzes/${quiz.id}`}>
                                        <Button className="w-full">
                                            Take Quiz
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Quiz History */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Quiz Attempts</h2>
                {!quizHistory || quizHistory.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                No quiz attempts yet. Generate your first quiz!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {quizHistory.map((submission) => (
                            <Card key={submission.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`p-3 rounded-lg ${submission.passed
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-red-500/10 text-red-400'
                                                    }`}
                                            >
                                                {submission.passed ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : (
                                                    <XCircle className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {submission.quiz?.title || 'Quiz'}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Completed {formatDateTime(submission.completedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold">
                                                {submission.score}%
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {submission.passed ? 'Passed' : 'Failed'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
