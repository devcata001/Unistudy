'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { quizzesApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PageProps {
    params: { id: string }
}

export default function QuizTakePage({ params }: PageProps) {
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({}) // questionId -> answerId
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [quizStarted, setQuizStarted] = useState(false)
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [score, setScore] = useState<number | null>(null)

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', params.id],
        queryFn: async () => {
            const response = await quizzesApi.getById(params.id)
            return response.data
        },
    })

    const submitMutation = useMutation({
        mutationFn: () => quizzesApi.submit(params.id, answers),
        onSuccess: (response) => {
            console.log('Quiz submission response:', response.data)
            setQuizSubmitted(true)
            // Make sure we're getting the score correctly
            const submissionScore = response.data.score || 0
            console.log('Setting score to:', submissionScore)
            setScore(submissionScore)
        },
    })

    // Timer effect
    useEffect(() => {
        if (!quizStarted || !quiz?.timeLimit) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [quizStarted, quiz])

    const handleStart = () => {
        setQuizStarted(true)
        if (quiz?.timeLimit) {
            setTimeLeft(quiz.timeLimit * 60) // Convert minutes to seconds
        }
    }

    const handleAnswer = (questionId: string, answerId: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }))
    }

    const handleSubmit = () => {
        if (Object.keys(answers).length === quiz?.questions.length) {
            submitMutation.mutate()
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading quiz...</p>
                </div>
            </div>
        )
    }

    if (!quiz) {
        return (
            <div className="max-w-2xl mx-auto mt-20 text-center">
                <p className="text-muted-foreground">Quiz not found</p>
                <Button onClick={() => router.push('/dashboard/quizzes')} className="mt-4">
                    Back to Quizzes
                </Button>
            </div>
        )
    }

    // Quiz Results Screen
    if (quizSubmitted && score !== null) {
        const passingScore = quiz.passingScore || 70
        const passed = score >= passingScore
        console.log('Score:', score, 'Passing Score:', passingScore, 'Passed:', passed)

        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className={`text-center ${passed ? 'border-green-500' : 'border-red-500'}`}>
                    <CardHeader>
                        <div className={`mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center ${passed ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}>
                            {passed ? (
                                <Trophy className="h-10 w-10 text-green-500" />
                            ) : (
                                <XCircle className="h-10 w-10 text-red-500" />
                            )}
                        </div>
                        <CardTitle className="text-3xl">
                            {passed ? 'Congratulations!' : 'Keep Trying!'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="text-5xl font-bold text-cyan-400 mb-2">
                                {Math.round(score)}%
                            </div>
                            <p className="text-muted-foreground">
                                {passed ? 'You passed the quiz!' : `Passing score: ${passingScore}%`}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            <div className="p-4 bg-secondary rounded-lg">
                                <div className="text-2xl font-bold">
                                    {Math.round((score / 100) * quiz.questions.length)}
                                </div>
                                <div className="text-sm text-muted-foreground">Correct</div>
                            </div>
                            <div className="p-4 bg-secondary rounded-lg">
                                <div className="text-2xl font-bold">
                                    {quiz.questions.length - Math.round((score / 100) * quiz.questions.length)}
                                </div>
                                <div className="text-sm text-muted-foreground">Incorrect</div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => router.push('/dashboard/quizzes')}>
                                Back to Quizzes
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                Retake Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Quiz Start Screen
    if (!quizStarted) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-secondary rounded-lg text-center">
                                <div className="text-2xl font-bold text-cyan-400">
                                    {quiz.questions.length}
                                </div>
                                <div className="text-sm text-muted-foreground">Questions</div>
                            </div>
                            {quiz.timeLimit && (
                                <div className="p-4 bg-secondary rounded-lg text-center">
                                    <div className="text-2xl font-bold text-cyan-400">
                                        {quiz.timeLimit}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Minutes</div>
                                </div>
                            )}
                            <div className="p-4 bg-secondary rounded-lg text-center">
                                <div className="text-2xl font-bold text-cyan-400">
                                    {quiz.passingScore}%
                                </div>
                                <div className="text-sm text-muted-foreground">Pass Score</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold">Instructions:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Answer all {quiz.questions.length} questions</li>
                                {quiz.timeLimit && <li>Complete within {quiz.timeLimit} minutes</li>}
                                <li>You need {quiz.passingScore}% to pass</li>
                                <li>Click on an option to select your answer</li>
                                <li>You can navigate between questions</li>
                            </ul>
                        </div>

                        <Button onClick={handleStart} className="w-full" size="lg">
                            Start Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Quiz Taking Screen
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
    const question = quiz.questions[currentQuestion]

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header with Timer */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Question {currentQuestion + 1} of {quiz.questions.length}
                            </p>
                            <Progress value={progress} className="w-48 mt-2" />
                        </div>
                        {quiz.timeLimit && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-cyan-400" />
                                <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : ''
                                    }`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Question Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{question.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {question.answers?.sort((a, b) => a.order - b.order).map((answer, idx) => (
                        <button
                            key={answer.id}
                            onClick={() => handleAnswer(question.id, answer.id)}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${answers[question.id] === answer.id
                                ? 'border-cyan-400 bg-cyan-400/10'
                                : 'border-border hover:border-cyan-400/50'
                                }`}
                        >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                            {answer.answerText}
                        </button>
                    )) || <p className="text-muted-foreground">No options available</p>}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </Button>

                <div className="flex gap-2">
                    {currentQuestion === quiz.questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length !== quiz.questions.length || submitMutation.isPending}
                        >
                            {submitMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>

            {/* Question Navigation Dots */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {quiz.questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${idx === currentQuestion
                                    ? 'bg-cyan-400 text-background'
                                    : answers[q.id]
                                        ? 'bg-secondary text-foreground'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
