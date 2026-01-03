'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CourseRegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    courseCount: number
}

export function CourseRegistrationModal({ isOpen, onClose, courseCount }: CourseRegistrationModalProps) {
    const router = useRouter()
    const [canSkip, setCanSkip] = useState(false)

    useEffect(() => {
        // Allow skipping after 10 seconds (but discourage it)
        const timer = setTimeout(() => setCanSkip(true), 10000)
        return () => clearTimeout(timer)
    }, [])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-300">
                {canSkip && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                <CardHeader className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
                        <GraduationCap className="h-10 w-10 text-cyan-400" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">
                        Welcome to UniStudy! 🎓
                    </CardTitle>
                    <CardDescription className="text-base">
                        Let's get you started by registering for your first course
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Why register for courses?</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-cyan-400 text-xs">1</span>
                                </div>
                                <span>Access AI-powered tutoring tailored to your courses</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-cyan-400 text-xs">2</span>
                                </div>
                                <span>Generate custom quizzes and practice questions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-cyan-400 text-xs">3</span>
                                </div>
                                <span>Upload and organize your study materials</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-cyan-400 text-xs">4</span>
                                </div>
                                <span>Track your progress and compete on leaderboards</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            size="lg"
                            className="flex-1 text-base"
                            onClick={() => router.push('/dashboard/courses')}
                        >
                            Register My First Course
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        {canSkip && (
                            <Button
                                size="lg"
                                variant="ghost"
                                onClick={onClose}
                                className="text-muted-foreground"
                            >
                                Skip for now
                            </Button>
                        )}
                    </div>

                    {!canSkip && (
                        <p className="text-xs text-center text-muted-foreground">
                            You can skip this in {10 - Math.floor((Date.now() % 10000) / 1000)} seconds
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
