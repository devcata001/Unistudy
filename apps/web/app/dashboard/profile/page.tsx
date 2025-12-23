'use client'

import { useAuth } from '@/hooks/useAuth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, GraduationCap, Trophy, Flame, Coins, BookOpen } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        department: user?.department || '',
        level: user?.level || '100',
    })

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                department: user.department || '',
                level: user.level || '100',
            })
        }
    }, [user])

    const { data: stats } = useQuery({
        queryKey: ['user', 'stats'],
        queryFn: async () => {
            const response = await usersApi.getStats()
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

    const updateMutation = useMutation({
        mutationFn: (data: any) => {
            console.log('Updating profile with data:', data)
            return usersApi.updateProfile(data)
        },
        onSuccess: async (response) => {
            console.log('Profile updated successfully:', response)
            // Invalidate all user-related queries
            await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
            await queryClient.invalidateQueries({ queryKey: ['user'] })

            // Refetch user data
            await queryClient.refetchQueries({ queryKey: ['auth', 'me'] })

            setIsEditing(false)
        },
        onError: (error: any) => {
            console.error('Failed to update profile:', error)
            alert('Failed to update profile: ' + (error?.response?.data?.message || error?.message || 'Unknown error'))
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitting form with data:', formData)
        updateMutation.mutate(formData)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account and view your progress
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-20 w-20 rounded-full bg-cyan-400/10 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-cyan-400">
                                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {user?.firstName} {user?.lastName}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {user?.department} • {user?.level} Level
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <Input
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <Input
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <Input
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Level</label>
                                        <select
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="100">100 Level</option>
                                            <option value="200">200 Level</option>
                                            <option value="300">300 Level</option>
                                            <option value="400">400 Level</option>
                                            <option value="500">500 Level</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={updateMutation.isPending}>
                                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Mail className="h-5 w-5" />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <GraduationCap className="h-5 w-5" />
                                        <span>{user?.department}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <BookOpen className="h-5 w-5" />
                                        <span>{user?.level} Level</span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-border">
                                <Button variant="destructive" onClick={() => logout()} className="w-full">
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Coins className="h-5 w-5 text-yellow-500" />
                                    <span className="text-sm">Points</span>
                                </div>
                                <span className="font-bold">{user?.points || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    <span className="text-sm">Streak</span>
                                </div>
                                <span className="font-bold">{user?.studyStreak || 0} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-cyan-400" />
                                    <span className="text-sm">Courses</span>
                                </div>
                                <span className="font-bold">{enrolledCourses?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-purple-400" />
                                    <span className="text-sm">Avg Score</span>
                                </div>
                                <span className="font-bold">{stats?.averageScore || 0}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
