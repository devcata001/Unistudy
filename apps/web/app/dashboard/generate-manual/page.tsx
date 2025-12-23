'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aiApi, materialsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Sparkles, Download, Loader2, Save, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GenerateManualPage() {
    const queryClient = useQueryClient()
    const [courseCode, setCourseCode] = useState('')
    const [courseTitle, setCourseTitle] = useState('')
    const [generatedManual, setGeneratedManual] = useState('')
    const [isSaved, setIsSaved] = useState(false)
    const router = useRouter()

    const generateMutation = useMutation({
        mutationFn: async () => {
            const prompt = `You are a university professor creating a comprehensive study guide for students.

Generate a detailed study manual for: ${courseCode} - ${courseTitle}

CRITICAL FORMATTING RULES:
- Write ONLY plain text - NO HTML tags at all (no <p>, <h1>, <div>, <strong>, <br>, etc.)
- NO markdown symbols (no *, **, #, ##, etc.)
- NO code or programming syntax
- Use only plain text with line breaks and simple formatting:
  * Use ALL CAPS for main section headings
  * Use numbers for main sections (1., 2., 3.)
  * Use dashes (-) or bullets (•) for lists
  * Use blank lines to separate sections
  * That's it - just plain readable text!

Write as a knowledgeable professor teaching students. Be conversational and clear.

Structure the manual with these sections:

1. COURSE INTRODUCTION
What this course is about, why it matters, and what students will learn.

2. KEY TOPICS AND CONCEPTS
List and explain the main topics. Break down each concept clearly. Show how they connect.

3. IMPORTANT DEFINITIONS
Define key terms that students must know. Give examples where helpful.

4. CORE PRINCIPLES AND THEORIES
Explain the fundamental principles. Describe major theories or frameworks. Show how to apply them.

5. FORMULAS AND CALCULATIONS (if applicable for science/math courses)
List important formulas in plain text. Explain when to use each. Give example problems.

6. REAL-WORLD APPLICATIONS
How this knowledge is used in real life. Career relevance. Industry examples.

7. STUDY TIPS AND EXAM PREPARATION
What to focus on when studying. Common mistakes to avoid. Memory techniques.

8. PRACTICE QUESTIONS
List 5-10 questions students should be able to answer after studying.

9. SUMMARY AND KEY TAKEAWAYS
The most important points to remember. Quick revision checklist.

Make it comprehensive, educational, and easy to read. Write 800-1200 words total.`

            const response = await aiApi.ask(prompt)
            return response.data.answer
        },
        onSuccess: (data) => {
            // Strip any HTML tags that might have slipped through
            const cleanText = data.replace(/<[^>]*>/g, '')
            setGeneratedManual(cleanText)
            setIsSaved(false)
        },
    })

    const saveMutation = useMutation({
        mutationFn: async () => {
            const title = `${courseCode} - ${courseTitle} Study Manual`
            return await materialsApi.saveManual(title, generatedManual, courseCode)
        },
        onSuccess: () => {
            setIsSaved(true)
            // Invalidate materials cache to show the new manual
            queryClient.invalidateQueries({ queryKey: ['materials'] })
            setTimeout(() => {
                router.push('/dashboard/materials')
            }, 1500)
        },
    })

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!courseCode.trim() || !courseTitle.trim()) return
        generateMutation.mutate()
    }

    const handleDownload = () => {
        const blob = new Blob([generatedManual], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${courseCode}_Study_Manual.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleSave = () => {
        saveMutation.mutate()
    }

    return (
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 p-3 md:p-6">
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold flex items-center gap-2 text-foreground">
                    <Sparkles className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-cyan-400" />
                    AI Study Manual Generator
                </h1>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground mt-1">
                    Generate comprehensive study materials for any course instantly
                </p>
            </div>

            <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
                {/* Input Form */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg text-foreground">
                                <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-cyan-400" />
                                Course Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleGenerate} className="space-y-3 md:space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="courseCode" className="text-sm text-foreground">Course Code</Label>
                                    <Input
                                        id="courseCode"
                                        placeholder="e.g., CSC 301"
                                        value={courseCode}
                                        onChange={(e) => setCourseCode(e.target.value)}
                                        disabled={generateMutation.isPending}
                                        className="bg-background text-foreground text-sm md:text-base"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="courseTitle" className="text-sm text-foreground">Course Title</Label>
                                    <Input
                                        id="courseTitle"
                                        placeholder="e.g., Data Structures"
                                        value={courseTitle}
                                        onChange={(e) => setCourseTitle(e.target.value)}
                                        disabled={generateMutation.isPending}
                                        className="bg-background text-foreground text-sm md:text-base"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full text-sm md:text-base"
                                    disabled={
                                        !courseCode.trim() ||
                                        !courseTitle.trim() ||
                                        generateMutation.isPending
                                    }
                                >
                                    {generateMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                                            Generate Manual
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Quick Examples */}
                    <Card className="hidden md:block">
                        <CardHeader>
                            <CardTitle className="text-sm text-foreground">Quick Examples</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left text-xs md:text-sm"
                                onClick={() => {
                                    setCourseCode('PHY 101')
                                    setCourseTitle('General Physics I')
                                }}
                                disabled={generateMutation.isPending}
                            >
                                <div className="text-foreground truncate">
                                    <div className="font-medium">PHY 101</div>
                                    <div className="text-xs text-muted-foreground">General Physics I</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left text-xs md:text-sm"
                                onClick={() => {
                                    setCourseCode('CSC 301')
                                    setCourseTitle('Data Structures')
                                }}
                                disabled={generateMutation.isPending}
                            >
                                <div className="text-foreground truncate">
                                    <div className="font-medium">CSC 301</div>
                                    <div className="text-xs text-muted-foreground">Data Structures</div>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Generated Manual */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-3 md:pb-4">
                        <CardTitle className="text-base md:text-lg text-foreground">Generated Study Manual</CardTitle>
                        {generatedManual && (
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={saveMutation.isPending || isSaved}
                                    className="text-xs md:text-sm"
                                >
                                    {isSaved ? (
                                        <>
                                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />
                                            Saved!
                                        </>
                                    ) : saveMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                            Save
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="text-xs md:text-sm"
                                >
                                    <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                    Download
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-3 md:p-6">
                        {!generatedManual && !generateMutation.isPending && (
                            <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center px-4">
                                <BookOpen className="h-12 w-12 md:h-16 md:w-16 mb-3 md:mb-4 text-muted-foreground opacity-20" />
                                <p className="text-sm md:text-base text-foreground font-medium">Your study manual will appear here</p>
                                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                                    Fill in the course details and click generate
                                </p>
                            </div>
                        )}

                        {generateMutation.isPending && (
                            <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
                                <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-cyan-400 mb-3 md:mb-4" />
                                <p className="text-sm md:text-base text-foreground font-medium">Generating your study manual...</p>
                                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                                    This may take 20-30 seconds
                                </p>
                            </div>
                        )}

                        {generatedManual && (
                            <div className="bg-muted/30 border border-border rounded-lg p-3 md:p-4 lg:p-6 max-h-[500px] md:max-h-[600px] overflow-y-auto">
                                <pre className="whitespace-pre-wrap break-words font-sans text-xs md:text-sm lg:text-base text-foreground leading-relaxed">
                                    {generatedManual}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
