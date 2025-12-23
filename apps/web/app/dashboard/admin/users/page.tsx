'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Trash2, Shield, UserX, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function AdminUsersPage() {
    const { user } = useAuth()
    const router = useRouter()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')

    if (user?.role !== 'ADMIN') {
        router.push('/dashboard')
        return null
    }

    const { data, isLoading } = useQuery({
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
    })

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => adminApi.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
            alert('User deleted successfully')
        },
        onError: () => {
            alert('Failed to delete user')
        },
    })

    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            adminApi.updateUserRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
            alert('User role updated successfully')
        },
        onError: () => {
            alert('Failed to update user role')
        },
    })

    const handleDeleteUser = (userId: string, userName: string) => {
        if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
            deleteMutation.mutate(userId)
        }
    }

    const handleChangeRole = (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN'
        if (confirm(`Change user role to ${newRole}?`)) {
            updateRoleMutation.mutate({ userId, role: newRole })
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground mt-1">
                    Manage all platform users
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, department..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 rounded-md border border-input bg-background"
                        >
                            <option value="">All Roles</option>
                            <option value="STUDENT">Student</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{data?.total || 0}</div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{data?.totalPages || 0}</div>
                        <p className="text-sm text-muted-foreground">Total Pages</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">Page {data?.page || 1}</div>
                        <p className="text-sm text-muted-foreground">Current Page</p>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({data?.total || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center py-8 text-muted-foreground">Loading...</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium">Name</th>
                                            <th className="text-left py-3 px-4 font-medium">Email</th>
                                            <th className="text-left py-3 px-4 font-medium">Department</th>
                                            <th className="text-left py-3 px-4 font-medium">University</th>
                                            <th className="text-left py-3 px-4 font-medium">Role</th>
                                            <th className="text-left py-3 px-4 font-medium">Courses</th>
                                            <th className="text-left py-3 px-4 font-medium">Points</th>
                                            <th className="text-right py-3 px-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.users?.map((u: any) => (
                                            <tr key={u.id} className="border-b hover:bg-muted/30">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {u.firstName} {u.lastName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {u.level} Level
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{u.email}</td>
                                                <td className="py-3 px-4 text-sm">{u.department || 'N/A'}</td>
                                                <td className="py-3 px-4 text-sm">{u.university || 'N/A'}</td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded ${u.role === 'ADMIN'
                                                            ? 'bg-red-500/10 text-red-500'
                                                            : 'bg-cyan-500/10 text-cyan-500'
                                                            }`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{u._count?.courses || 0}</td>
                                                <td className="py-3 px-4 text-sm font-medium text-cyan-400">
                                                    {u.points}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleChangeRole(u.id, u.role)}
                                                            title={u.role === 'ADMIN' ? 'Demote to Student' : 'Promote to Admin'}
                                                        >
                                                            <Shield className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)
                                                            }
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!data?.users || data.users.length === 0) && (
                                            <tr>
                                                <td colSpan={8} className="text-center py-8 text-muted-foreground">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {data && data.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total} users
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={page >= data.totalPages}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
