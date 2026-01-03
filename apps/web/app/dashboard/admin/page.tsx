'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, BookOpen, FileText, Activity, TrendingUp, Brain, Search, Trash2, Shield, UserX, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UserDetails {
    id: string
    email: string
    firstName: string
    lastName: string
    department: string
    faculty: string
    level: string
    university: string
    matricNumber?: string
    role: string
    points: number
    createdAt: string
    _count?: {
        courses: number
        quizAttempts: number
    }
}

export default function AdminDashboard() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [isAdmin, setIsAdmin] = useState(false)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)

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

    // Users data with pagination
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['admin', 'users', page, search, roleFilter],
        queryFn: async () => {
            const response = await adminApi.getAllUsers({
                page,
                limit: 20,
                search: search || undefined,
                role: roleFilter || undefined,
            })
            return response.data
        },
        enabled: isAdmin,
    })

    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: (userId: string) => adminApi.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
            toast.success('User deleted successfully')
        },
        onError: () => {
            toast.error('Failed to delete user')
        },
    })

    // Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            adminApi.updateUserRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
            toast.success('User role updated successfully')
        },
        onError: () => {
            toast.error('Failed to update user role')
        },
    })

    // Seed database mutation
    const seedDatabaseMutation = useMutation({
        mutationFn: () => adminApi.seedDatabase(),
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['admin'] })
                toast.success('Database reseeded successfully! 22 real university courses added.')
            } else {
                toast.error('Failed to reseed database: ' + data.message)
            }
        },
        onError: (error: any) => {
            toast.error('Error reseeding database: ' + (error.message || 'Unknown error'))
        },
    })

    const handleViewDetails = (user: UserDetails) => {
        setSelectedUser(user)
        setShowDetailsDialog(true)
    }

    const handleDelete = async (userId: string, userName: string) => {
        if (confirm(`Are you sure you want to delete ${userName}?`)) {
            deleteMutation.mutate(userId)
        }
    }

    const handleRoleChange = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN'
        if (confirm(`Change user role to ${newRole}?`)) {
            updateRoleMutation.mutate({ userId, role: newRole })
        }
    }

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
            {/* Header with Reseed Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor platform activity and manage users
                    </p>
                </div>
                <Button
                    onClick={() => {
                        if (confirm('⚠️ WARNING: This will delete ALL existing data and reseed the database with 22 real university courses. Continue?')) {
                            seedDatabaseMutation.mutate()
                        }
                    }}
                    variant="destructive"
                    disabled={seedDatabaseMutation.isPending}
                    className="gap-2"
                >
                    <BookOpen className="h-4 w-4" />
                    {seedDatabaseMutation.isPending ? 'Reseeding...' : 'Reseed Courses'}
                </Button>
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

            {/* User Management Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">User Management</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value)
                                setPage(1)
                            }}
                            className="px-3 py-2 bg-background border border-input rounded-md text-sm w-full sm:w-auto"
                        >
                            <option value="">All Roles</option>
                            <option value="STUDENT">Students</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    {usersLoading ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Loading users...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                                <table className="w-full min-w-[640px]">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2 md:p-3 font-medium">Name</th>
                                            <th className="text-left p-2 md:p-3 font-medium hidden sm:table-cell">Email</th>
                                            <th className="text-left p-2 md:p-3 font-medium hidden lg:table-cell">Department</th>
                                            <th className="text-left p-2 md:p-3 font-medium hidden xl:table-cell">University</th>
                                            <th className="text-left p-2 md:p-3 font-medium">Role</th>
                                            <th className="text-left p-2 md:p-3 font-medium hidden md:table-cell">Courses</th>
                                            <th className="text-left p-2 md:p-3 font-medium hidden md:table-cell">Points</th>
                                            <th className="text-right p-2 md:p-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersData?.users?.map((user: UserDetails) => (
                                            <tr key={user.id} className="border-b hover:bg-muted/50">
                                                <td className="p-2 md:p-3">
                                                    <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                                                </td>
                                                <td className="p-2 md:p-3 text-sm text-muted-foreground hidden sm:table-cell">{user.email}</td>
                                                <td className="p-2 md:p-3 text-sm hidden lg:table-cell">{user.department}</td>
                                                <td className="p-2 md:p-3 text-sm hidden xl:table-cell">{user.university || <span className="text-muted-foreground italic">Not set</span>}</td>
                                                <td className="p-2 md:p-3">
                                                    <span className={`text-xs px-2 py-1 rounded ${user.role === 'ADMIN'
                                                        ? 'bg-red-500/10 text-red-500'
                                                        : 'bg-cyan-500/10 text-cyan-500'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-2 md:p-3 text-sm hidden md:table-cell">{user._count?.courses || 0}</td>
                                                <td className="p-2 md:p-3 hidden md:table-cell">
                                                    <span className="font-semibold text-cyan-400 text-sm">{user.points}</span>
                                                </td>
                                                <td className="p-2 md:p-3">
                                                    <div className="flex gap-1 justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleViewDetails(user)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 hidden sm:flex"
                                                            onClick={() => handleRoleChange(user.id, user.role)}
                                                            title="Change Role"
                                                        >
                                                            <Shield className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hidden sm:flex"
                                                            onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                                                            title="Delete User"
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

                            {/* Pagination */}
                            {usersData && usersData.totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                                        Page {usersData.page} of {usersData.totalPages} ({usersData.total} users)
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="text-xs sm:text-sm"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden sm:inline ml-1">Previous</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(usersData.totalPages, p + 1))}
                                            disabled={page === usersData.totalPages}
                                            className="text-xs sm:text-sm"
                                        >
                                            <span className="hidden sm:inline mr-1">Next</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* User Details Modal */}
            {selectedUser && showDetailsDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetailsDialog(false)}>
                    <div className="bg-background rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                                <p className="text-muted-foreground">{selectedUser.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowDetailsDialog(false)}>✕</Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">University</label>
                                    <p className="text-base mt-1">{selectedUser.university || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                                    <p className="text-base mt-1">{selectedUser.department}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Faculty</label>
                                    <p className="text-base mt-1">{selectedUser.faculty}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Level</label>
                                    <p className="text-base mt-1">{selectedUser.level}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Matric Number</label>
                                    <p className="text-base mt-1">{selectedUser.matricNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                                    <p className="text-base mt-1">
                                        <span className={`text-xs px-2 py-1 rounded ${selectedUser.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                                            {selectedUser.role}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Points</label>
                                    <p className="text-2xl font-bold text-cyan-400 mt-1">{selectedUser.points}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Joined</label>
                                    <p className="text-base mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {selectedUser._count && (
                                <div className="border-t pt-4 mt-4">
                                    <h3 className="font-semibold mb-3">Activity Statistics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Enrolled Courses</label>
                                            <p className="text-2xl font-bold">{selectedUser._count.courses}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Quiz Attempts</label>
                                            <p className="text-2xl font-bold">{selectedUser._count.quizAttempts}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
