'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesApi, usersApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Search, BookOpen, Users, CheckCircle, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function CoursesPage() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTab, setSelectedTab] = useState<'all' | 'enrolled'>('all')
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newCourse, setNewCourse] = useState({
        code: '',
        name: '',
        description: 'Auto-generated course',
        department: 'General',
        level: 100,
    })

    const { data: allCourses, isLoading: loadingAll } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await coursesApi.getAll()
            return response.data
        },
    })

    const { data: enrolledCourses, isLoading: loadingEnrolled } = useQuery({
        queryKey: ['user', 'courses'],
        queryFn: async () => {
            const response = await usersApi.getEnrolledCourses()
            return response.data
        },
    })

    const enrollMutation = useMutation({
        mutationFn: (courseId: string) => coursesApi.enroll(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'courses'] })
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        },
    })

    const createMutation = useMutation({
        mutationFn: (courseData: typeof newCourse) => coursesApi.create(courseData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            queryClient.invalidateQueries({ queryKey: ['user', 'courses'] })
            setShowCreateForm(false)
            setNewCourse({
                code: '',
                name: '',
                description: 'Auto-generated course',
                department: 'General',
                level: 100,
            })
        },
    })

    const isEnrolled = (courseId: string) => {
        return enrolledCourses?.some((course) => course.id === courseId)
    }

    const displayCourses = selectedTab === 'all' ? allCourses : enrolledCourses
    const filteredCourses = displayCourses?.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const isLoading = selectedTab === 'all' ? loadingAll : loadingEnrolled

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault()
        createMutation.mutate(newCourse)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">My Courses</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Browse and manage your courses
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/dashboard/courses/manage">
                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                            <BookOpen className="h-4 w-4" />
                            <span className="hidden sm:inline">Manage All Courses</span>
                            <span className="sm:hidden">Manage</span>
                        </Button>
                    </Link>
                    <Button onClick={() => setShowCreateForm(true)} className="gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Add Course
                    </Button>
                </div>
            </div>

            {/* Create Course Form */}
            {showCreateForm && (
                <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Create New Course</CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowCreateForm(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Course Code</label>
                                    <Input
                                        placeholder="e.g., CSC301"
                                        value={newCourse.code}
                                        onChange={(e) =>
                                            setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Course Title</label>
                                    <Input
                                        placeholder="e.g., Data Structures"
                                        value={newCourse.name}
                                        onChange={(e) =>
                                            setNewCourse({ ...newCourse, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
                                    {createMutation.isPending ? 'Creating...' : 'Create Course'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateForm(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Search and Tabs */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 p-1 bg-secondary rounded-lg w-full lg:w-auto">
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`flex-1 lg:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${selectedTab === 'all'
                            ? 'bg-background text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        All Courses
                    </button>
                    <button
                        onClick={() => setSelectedTab('enrolled')}
                        className={`flex-1 lg:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${selectedTab === 'enrolled'
                            ? 'bg-background text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Enrolled ({enrolledCourses?.length || 0})
                    </button>
                </div>
            </div>

            {/* Courses Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-6 bg-secondary rounded w-1/2 mb-2" />
                                <div className="h-4 bg-secondary rounded w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-20 bg-secondary rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredCourses && filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const enrolled = isEnrolled(course.id)
                        const enrolledData = enrolledCourses?.find((c) => c.id === course.id)

                        return (
                            <Card key={course.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="p-2 rounded-lg bg-cyan-400/10">
                                            <BookOpen className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        {enrolled && (
                                            <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-cyan-400/10 text-cyan-400">
                                                <CheckCircle className="h-3 w-3" />
                                                Enrolled
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg">{course.code}</CardTitle>
                                    <CardDescription>{course.name}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <span>{course.department}</span>
                                        <span>•</span>
                                        <span>{course.level} Level</span>
                                    </div>

                                    {enrolled && enrolledData?.enrollment && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span className="font-medium">
                                                    {enrolledData.enrollment.progress}%
                                                </span>
                                            </div>
                                            <Progress value={enrolledData.enrollment.progress} className="h-2" />
                                        </div>
                                    )}

                                    <div className="mt-auto pt-4">
                                        {enrolled ? (
                                            <Link href={`/dashboard/courses/${course.id}`} className="block">
                                                <Button className="w-full">View Course</Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                                onClick={() => enrollMutation.mutate(course.id)}
                                                disabled={enrollMutation.isPending}
                                            >
                                                {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {searchQuery
                                ? 'No courses found matching your search'
                                : selectedTab === 'enrolled'
                                    ? 'You haven\'t enrolled in any courses yet'
                                    : 'No courses available'}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
