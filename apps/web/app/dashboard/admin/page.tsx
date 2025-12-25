'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, FileText, Activity, TrendingUp, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)

    // Check if admin is logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('admin_token')
        if (!adminToken) {
            router.push('/admin/login')
            return
        }
        setIsAdmin(true)
    }, [router])

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['admin', 'dashboard', 'stats'],
        queryFn: async () => {
            const response = await adminApi.getDashboardStats()
            return response.data
        },
        enabled: isAdmin,
        refetchOnMount: true,
        staleTime: 0,
    })

    const { data: userAnalytics } = useQuery({
        queryKey: ['admin', 'analytics', 'users'],
        queryFn: async () => {
            const response = await adminApi.getUserAnalytics()
            return response.data
        },
        enabled: isAdmin,
        refetchOnMount: true,
        staleTime: 0,
    })

    const { data: quizAnalytics } = useQuery({
        queryKey: ['admin', 'analytics', 'quizzes'],
        queryFn: async () => {
            const response = await adminApi.getQuizAnalytics()
            return response.data
        },
        enabled: isAdmin,
        refetchOnMount: true,
        staleTime: 0,
    })

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-red-500">Error loading dashboard data</p>
                <p className="text-sm text-muted-foreground">{(error as any)?.message}</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor platform activity and manage users
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats?.activeUsersToday || 0} active today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Registered courses
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalQuizzes || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {quizAnalytics?.totalAttempts || 0} attempts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalMaterials || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Uploaded files
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-cyan-400" />
                            Recent Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.recentUsers?.map((user: any) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-sm">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.department} • {user.university}
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No recent users
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quiz Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-cyan-400" />
                            Platform Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Average Quiz Score</span>
                                <span className="text-lg font-bold text-cyan-400">
                                    {quizAnalytics?.averageScore?.toFixed(1) || 0}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Quiz Attempts</span>
                                <span className="text-lg font-bold">
                                    {quizAnalytics?.totalAttempts || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Users by Role</span>
                                <div className="text-right">
                                    {userAnalytics?.usersByRole?.map((item: any) => (
                                        <div key={item.role} className="text-sm">
                                            <span className="text-muted-foreground">{item.role}:</span>{' '}
                                            <span className="font-medium">{item._count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Departments */}
            {userAnalytics?.topDepartments && userAnalytics.topDepartments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {userAnalytics.topDepartments.slice(0, 5).map((dept: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm">{dept.department || 'Not specified'}</span>
                                    <span className="text-sm font-medium text-cyan-400">
                                        {dept._count} users
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
