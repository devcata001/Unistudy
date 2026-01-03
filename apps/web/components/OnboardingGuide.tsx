'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, CheckCircle, ArrowRight, Mail, User, BookOpen } from 'lucide-react'

interface OnboardingGuideProps {
    user: any
    hasCourses: boolean
}

export default function OnboardingGuide({ user, hasCourses }: OnboardingGuideProps) {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)

    useEffect(() => {
        // Check if onboarding has been dismissed
        const dismissed = localStorage.getItem('onboarding_dismissed')
        if (dismissed) return

        // Determine current step based on user state
        if (!user?.isEmailVerified) {
            setCurrentStep(1)
            setIsVisible(true)
        } else if (!user?.university || !user?.department || !user?.level) {
            setCurrentStep(2)
            setIsVisible(true)
        } else if (!hasCourses) {
            setCurrentStep(3)
            setIsVisible(true)
        }
    }, [user, hasCourses])

    const handleDismiss = () => {
        localStorage.setItem('onboarding_dismissed', 'true')
        setIsVisible(false)
    }

    const handleNextStep = () => {
        if (currentStep === 1) {
            // Redirect to email verification
            router.push('/verify-email')
        } else if (currentStep === 2) {
            // Redirect to profile
            router.push('/dashboard/profile')
        } else if (currentStep === 3) {
            // Redirect to courses
            router.push('/dashboard/courses')
        }
    }

    if (!isVisible) return null

    const steps = [
        {
            number: 1,
            title: 'Verify Your Email',
            description: 'Secure your account and enable important notifications',
            icon: Mail,
            completed: user?.isEmailVerified,
            action: 'Verify Now',
        },
        {
            number: 2,
            title: 'Complete Your Profile',
            description: 'Add your university, department, and level for personalized experience',
            icon: User,
            completed: user?.university && user?.department && user?.level,
            action: 'Complete Profile',
        },
        {
            number: 3,
            title: 'Register Your Courses',
            description: 'Add courses to unlock AI tutor, quizzes, and study materials',
            icon: BookOpen,
            completed: hasCourses,
            action: 'Browse Courses',
        },
    ]

    const currentStepData = steps[currentStep - 1]
    const Icon = currentStepData.icon
    const progress = ((currentStep - 1) / steps.length) * 100

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md px-4 sm:px-0">
            <Card className="border-2 border-cyan-400/20 shadow-2xl">
                <CardContent className="p-6">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Getting Started</span>
                            <span className="text-sm text-muted-foreground">
                                Step {currentStep} of {steps.length}
                            </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Step indicator dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {steps.map((step) => (
                            <button
                                key={step.number}
                                onClick={() => setCurrentStep(step.number)}
                                className={`h-2 rounded-full transition-all ${step.completed
                                        ? 'bg-green-500 w-8'
                                        : step.number === currentStep
                                            ? 'bg-cyan-400 w-8'
                                            : 'bg-secondary w-2'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Current step content */}
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div
                                className={`p-4 rounded-full ${currentStepData.completed
                                        ? 'bg-green-500/10'
                                        : 'bg-cyan-400/10'
                                    }`}
                            >
                                {currentStepData.completed ? (
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                ) : (
                                    <Icon className="h-8 w-8 text-cyan-400" />
                                )}
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {currentStepData.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {currentStepData.description}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                        {!currentStepData.completed ? (
                            <>
                                <Button
                                    onClick={handleNextStep}
                                    className="flex-1"
                                    size="lg"
                                >
                                    {currentStepData.action}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                {currentStep < steps.length && (
                                    <Button
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        variant="outline"
                                        size="lg"
                                    >
                                        Skip
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    if (currentStep < steps.length) {
                                        setCurrentStep(currentStep + 1)
                                    } else {
                                        handleDismiss()
                                    }
                                }}
                                className="flex-1"
                                size="lg"
                                variant="outline"
                            >
                                {currentStep < steps.length ? 'Next Step' : 'Finish'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Quick navigation */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-center text-muted-foreground mb-2">
                            Quick access:
                        </p>
                        <div className="flex justify-center gap-2">
                            {steps.map((step) => (
                                <button
                                    key={step.number}
                                    onClick={() => setCurrentStep(step.number)}
                                    className={`text-xs px-2 py-1 rounded-md transition-colors ${step.completed
                                            ? 'bg-green-500/10 text-green-600'
                                            : step.number === currentStep
                                                ? 'bg-cyan-400/10 text-cyan-400'
                                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                                        }`}
                                    title={step.title}
                                >
                                    {step.completed ? '✓' : step.number}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
