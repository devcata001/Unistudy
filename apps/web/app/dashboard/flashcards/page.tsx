'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { aiApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Loader2, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'

interface Flashcard {
    question: string
    answer: string
}

export default function FlashcardsPage() {
    const [topic, setTopic] = useState('')
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [studyMode, setStudyMode] = useState(false)

    const generateMutation = useMutation({
        mutationFn: async (topicInput: string) => {
            const prompt = `Generate exactly 10 flashcards for studying: "${topicInput}"

Output ONLY in this exact JSON format (no markdown, no extra text):
[
  {
    "question": "What is...",
    "answer": "It is..."
  }
]

Requirements:
- Make questions challenging but educational
- Cover key concepts, definitions, examples, and applications
- Keep answers concise but complete
- NO markdown symbols (*, **, etc.)
- Output MUST be valid JSON array only`

            const response = await aiApi.ask(prompt)
            return response.data.answer
        },
        onSuccess: (data: string) => {
            try {
                // Try to extract JSON from the response
                let jsonStr = data.trim()

                // Remove markdown code blocks if present
                jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')

                // Find JSON array
                const jsonMatch = jsonStr.match(/\[[\s\S]*\]/)
                if (jsonMatch) {
                    jsonStr = jsonMatch[0]
                }

                const parsed = JSON.parse(jsonStr)
                const cards: Flashcard[] = parsed.map((item: any) => ({
                    question: item.question.replace(/\*\*/g, '').replace(/\*/g, ''),
                    answer: item.answer.replace(/\*\*/g, '').replace(/\*/g, '')
                }))

                setFlashcards(cards)
                setCurrentIndex(0)
                setIsFlipped(false)
                if (cards.length > 0) {
                    setStudyMode(true)
                }
            } catch (error) {
                console.error('Failed to parse flashcards:', error)
                // Fallback parsing
                const lines = data.split('\n')
                const cards: Flashcard[] = []
                let currentCard: Partial<Flashcard> = {}

                lines.forEach((line: string) => {
                    const trimmed = line.trim().replace(/\*\*/g, '').replace(/\*/g, '')
                    if (trimmed.startsWith('Q:') || trimmed.startsWith('"question"')) {
                        if (currentCard.question && currentCard.answer) {
                            cards.push(currentCard as Flashcard)
                        }
                        currentCard = { question: trimmed.replace(/^Q:\s*/, '').replace(/^"question":\s*"/, '').replace(/",$/, '') }
                    } else if (trimmed.startsWith('A:') || trimmed.startsWith('"answer"')) {
                        currentCard.answer = trimmed.replace(/^A:\s*/, '').replace(/^"answer":\s*"/, '').replace(/"$/, '')
                    }
                })

                // Add the last card
                if (currentCard.question && currentCard.answer) {
                    cards.push(currentCard as Flashcard)
                }

                setFlashcards(cards)
                setCurrentIndex(0)
                setIsFlipped(false)
                if (cards.length > 0) {
                    setStudyMode(true)
                }
            }
        },
    })

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!topic.trim()) return
        generateMutation.mutate(topic)
    }

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setIsFlipped(false)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setIsFlipped(false)
        }
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setIsFlipped(false)
    }

    const currentCard = flashcards[currentIndex]

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-cyan-400" />
                    AI Flashcards
                </h1>
                <p className="text-muted-foreground mt-1">
                    Generate and study flashcards for any topic
                </p>
            </div>

            {!studyMode ? (
                /* Generator Form */
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Flashcards</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Enter Topic or Course</Label>
                                <Input
                                    id="topic"
                                    placeholder="e.g., Data Structures - Binary Trees"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    disabled={generateMutation.isPending}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!topic.trim() || generateMutation.isPending}
                            >
                                {generateMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Flashcards...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Flashcards
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Examples */}
                        <div className="mt-6 space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">
                                Try these topics:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setTopic('Python Programming - Functions')
                                        generateMutation.mutate('Python Programming - Functions')
                                    }}
                                    disabled={generateMutation.isPending}
                                >
                                    Python Functions
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setTopic('Physics - Thermodynamics')
                                        generateMutation.mutate('Physics - Thermodynamics')
                                    }}
                                    disabled={generateMutation.isPending}
                                >
                                    Thermodynamics
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setTopic('Biology - Cell Structure')
                                        generateMutation.mutate('Biology - Cell Structure')
                                    }}
                                    disabled={generateMutation.isPending}
                                >
                                    Cell Structure
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* Study Mode */
                <div className="space-y-4">
                    {/* Progress */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Card {currentIndex + 1} of {flashcards.length}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStudyMode(false)}
                        >
                            Generate New Set
                        </Button>
                    </div>

                    {/* Flashcard */}
                    <Card
                        className="min-h-[400px] cursor-pointer transition-transform hover:scale-[1.02] relative"
                        onClick={handleFlip}
                    >
                        <CardContent className="flex items-center justify-center p-12 h-[400px]">
                            <div className="text-center space-y-4">
                                <div className="text-sm font-medium text-cyan-400 mb-4">
                                    {isFlipped ? 'Answer' : 'Question'}
                                </div>
                                <p className="text-2xl font-medium">
                                    {isFlipped ? currentCard?.answer : currentCard?.question}
                                </p>
                                <div className="text-sm text-muted-foreground mt-8">
                                    Click to flip
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleFlip}
                        >
                            <RotateCw className="mr-2 h-4 w-4" />
                            Flip Card
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            disabled={currentIndex === flashcards.length - 1}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-secondary rounded-full h-2">
                        <div
                            className="bg-cyan-400 h-2 rounded-full transition-all"
                            style={{
                                width: `${((currentIndex + 1) / flashcards.length) * 100}%`
                            }}
                        />
                    </div>

                    {/* Restart */}
                    {currentIndex === flashcards.length - 1 && (
                        <div className="text-center">
                            <Button onClick={handleRestart} variant="outline">
                                <RotateCw className="mr-2 h-4 w-4" />
                                Restart
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
