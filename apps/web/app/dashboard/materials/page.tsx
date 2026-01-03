'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { materialsApi, usersApi, aiApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Video, Link as LinkIcon, Download, ExternalLink, Sparkles, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function MaterialsPage() {
    const [selectedCourseId, setSelectedCourseId] = useState<string>('')
    const [summaryMaterialId, setSummaryMaterialId] = useState<string | null>(null)
    const [generatedSummary, setGeneratedSummary] = useState<string>('')

    // Get user's own materials
    const { data: userMaterials, isLoading: loadingUserMaterials, refetch: refetchUserMaterials } = useQuery({
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

    const { data: materials, isLoading } = useQuery({
        queryKey: ['materials', selectedCourseId],
        queryFn: async () => {
            const response = await materialsApi.getByCourse(selectedCourseId)
            return response.data
        },
        enabled: !!selectedCourseId,
    })

    const summaryMutation = useMutation({
        mutationFn: async (materialId: string) => {
            const material = [...(userMaterials || []), ...(materials || [])].find(m => m.id === materialId)
            if (!material) return ''

            const prompt = `Generate a concise summary of the following study material:

Title: ${material.title}
Content: ${material.extractedText || 'No content available'}

Please provide:
1. Main Topic Overview (2-3 sentences)
2. Key Points (bullet points)
3. Important Concepts
4. Quick Review Summary

Keep it concise and focused on the most important information for exam preparation.`

            const response = await aiApi.ask(prompt)
            return response.data.answer
        },
        onSuccess: (data, materialId) => {
            setGeneratedSummary(data)
            setSummaryMaterialId(materialId)
        },
    })

    const getIcon = (type: string) => {
        switch (type) {
            case 'PDF':
                return FileText
            case 'VIDEO':
                return Video
            case 'LINK':
                return LinkIcon
            default:
                return FileText
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'PDF':
                return 'bg-red-500/10 text-red-400'
            case 'VIDEO':
                return 'bg-purple-500/10 text-purple-400'
            case 'LINK':
                return 'bg-blue-500/10 text-blue-400'
            case 'DOCUMENT':
                return 'bg-cyan-500/10 text-cyan-400'
            default:
                return 'bg-gray-500/10 text-gray-400'
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Study Materials</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Access all your course materials in one place
                </p>
            </div>

            {/* User's Materials Section */}
            {userMaterials && userMaterials.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">My Study Materials</h2>
                    <div className="space-y-4">
                        {userMaterials.map((material) => {
                            const Icon = getIcon(material.type)
                            const isShowingSummary = summaryMaterialId === material.id

                            return (
                                <Card key={material.id}>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="flex items-start gap-3 sm:gap-4 flex-1">
                                                <div className={`p-2 sm:p-3 rounded-lg ${getTypeColor(material.type)}`}>
                                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base sm:text-lg truncate">{material.title}</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                        {material.type} • {new Date(material.createdAt).toLocaleDateString()}
                                                    </p>

                                                    {/* Summary Display */}
                                                    {isShowingSummary && generatedSummary && (
                                                        <div className="mt-4 p-3 sm:p-4 bg-secondary rounded-lg">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Sparkles className="h-4 w-4 text-cyan-400" />
                                                                <span className="text-sm font-medium">AI Summary</span>
                                                            </div>
                                                            <Textarea
                                                                value={generatedSummary}
                                                                readOnly
                                                                className="min-h-[200px] bg-background text-sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 sm:ml-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                                    onClick={() => {
                                                        if (isShowingSummary) {
                                                            setSummaryMaterialId(null)
                                                            setGeneratedSummary('')
                                                        } else {
                                                            summaryMutation.mutate(material.id)
                                                        }
                                                    }}
                                                    disabled={summaryMutation.isPending && summaryMutation.variables === material.id}
                                                >
                                                    {summaryMutation.isPending && summaryMutation.variables === material.id ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            <span className="hidden sm:inline">Generating...</span>
                                                            <span className="sm:hidden">...</span>
                                                        </>
                                                    ) : isShowingSummary ? (
                                                        <>
                                                            <span className="hidden sm:inline">Hide Summary</span>
                                                            <span className="sm:hidden">Hide</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="h-4 w-4 mr-1 sm:mr-2" />
                                                            <span className="hidden sm:inline">Generate Summary</span>
                                                            <span className="sm:hidden">Summary</span>
                                                        </>
                                                    )}
                                                </Button>
                                                {material.fileUrl && material.fileUrl.startsWith('http') && (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 sm:flex-none"
                                                        onClick={() => window.open(material.fileUrl, '_blank')}
                                                    >
                                                        <Download className="h-4 w-4 mr-1 sm:mr-2" />
                                                        <span className="hidden sm:inline">View</span>
                                                        <span className="sm:hidden">Open</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Course Selector */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Materials</CardTitle>
                    <CardDescription>Select a course to view materials shared by others</CardDescription>
                </CardHeader>
                <CardContent>
                    {!enrolledCourses || enrolledCourses.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                            You haven't enrolled in any courses yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {enrolledCourses.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => setSelectedCourseId(course.id)}
                                    className={`p-4 rounded-lg border text-left transition-colors ${selectedCourseId === course.id
                                        ? 'border-cyan-400 bg-cyan-400/10'
                                        : 'border-border hover:border-cyan-400/50'
                                        }`}
                                >
                                    <h3 className="font-semibold">{course.code}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{course.name}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Materials List */}
            {selectedCourseId && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Materials</h2>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="h-6 bg-secondary rounded w-1/2 mb-2" />
                                        <div className="h-4 bg-secondary rounded w-1/4" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : materials && materials.length > 0 ? (
                        <div className="space-y-4">
                            {materials.map((material) => {
                                const Icon = getIcon(material.type)

                                return (
                                    <Card key={material.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-lg ${getTypeColor(material.type)}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{material.title}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {material.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {material.type === 'LINK' ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => window.open(material.content, '_blank')}
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Open Link
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => window.open(material.content, '_blank')}
                                                        >
                                                            <Download className="h-4 w-4 mr-2" />
                                                            View
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    No materials available for this course yet
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}
