'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, BookOpen, Plus, Edit, Trash2, X, Save } from 'lucide-react'
import Link from 'next/link'

interface CourseFormData {
    code: string
    name: string
    description: string
    department: string
    level: number
}

export default function CourseManagementPage() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingCourse, setEditingCourse] = useState<string | null>(null)
    const [formData, setFormData] = useState<CourseFormData>({
        code: '',
        name: '',
        description: '',
        department: '',
        level: 100,
    })

    const { data: courses, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await coursesApi.getAll()
            return response.data
        },
    })

    const createMutation = useMutation({
        mutationFn: (data: CourseFormData) => coursesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            setShowCreateForm(false)
            resetForm()
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CourseFormData> }) =>
            coursesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            setEditingCourse(null)
            resetForm()
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => coursesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        },
    })

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            description: '',
            department: '',
            level: 100,
        })
    }

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        createMutation.mutate(formData)
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingCourse) {
            updateMutation.mutate({ id: editingCourse, data: formData })
        }
    }

    const handleEdit = (course: any) => {
        setEditingCourse(course.id)
        setFormData({
            code: course.code,
            name: course.name,
            description: course.description || '',
            department: course.department,
            level: parseInt(course.level),
        })
        setShowCreateForm(false)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            deleteMutation.mutate(id)
        }
    }

    const filteredCourses = courses?.filter(
        (course) =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Course Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Create, edit, and manage all courses
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Link href="/dashboard/courses" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto">Back to Courses</Button>
                    </Link>
                    <Button
                        onClick={() => {
                            setShowCreateForm(true)
                            setEditingCourse(null)
                            resetForm()
                        }}
                        className="gap-2 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        New Course
                    </Button>
                </div>
            </div>

            {/* Create/Edit Form */}
            {(showCreateForm || editingCourse) && (
                <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-400/5 to-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setShowCreateForm(false)
                                setEditingCourse(null)
                                resetForm()
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={editingCourse ? handleUpdate : handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Course Code</label>
                                    <Input
                                        placeholder="e.g., CSC301"
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({ ...formData, code: e.target.value.toUpperCase() })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Course Title</label>
                                    <Input
                                        placeholder="e.g., Data Structures"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    placeholder="Brief description of the course"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department</label>
                                    <Input
                                        placeholder="e.g., Computer Science"
                                        value={formData.department}
                                        onChange={(e) =>
                                            setFormData({ ...formData, department: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) =>
                                            setFormData({ ...formData, level: parseInt(e.target.value) })
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value={100}>100 Level</option>
                                        <option value={200}>200 Level</option>
                                        <option value={300}>300 Level</option>
                                        <option value={400}>400 Level</option>
                                        <option value={500}>500 Level</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="w-full sm:w-auto"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {editingCourse ? 'Update Course' : 'Create Course'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreateForm(false)
                                        setEditingCourse(null)
                                        resetForm()
                                    }}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search courses..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Courses Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">All Courses ({filteredCourses?.length || 0})</CardTitle>
                    <CardDescription className="text-sm">Manage all courses in the system</CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
                        </div>
                    ) : filteredCourses && filteredCourses.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-medium whitespace-nowrap">Code</th>
                                            <th className="text-left p-4 font-medium whitespace-nowrap">Title</th>
                                            <th className="text-left p-4 font-medium whitespace-nowrap">Department</th>
                                            <th className="text-left p-4 font-medium whitespace-nowrap">Level</th>
                                            <th className="text-right p-4 font-medium whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCourses.map((course) => (
                                            <tr key={course.id} className="border-b hover:bg-muted/50">
                                                <td className="p-4 font-medium whitespace-nowrap">{course.code}</td>
                                                <td className="p-4">{course.name}</td>
                                                <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                                                    {course.department}
                                                </td>
                                                <td className="p-4 text-sm whitespace-nowrap">{course.level} Level</td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(course)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDelete(course.id)}
                                                            disabled={deleteMutation.isPending}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3 p-4">
                                {filteredCourses.map((course) => (
                                    <Card key={course.id} className="border-muted">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-base">{course.code}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{course.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>{course.department}</span>
                                                <span>•</span>
                                                <span>{course.level} Level</span>
                                            </div>
                                            <div className="flex gap-2 pt-2 border-t">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(course)}
                                                    className="flex-1"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(course.id)}
                                                    disabled={deleteMutation.isPending}
                                                    className="text-destructive hover:text-destructive flex-1"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 px-4">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-sm">
                                {searchQuery ? 'No courses found matching your search' : 'No courses yet'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
