'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Shield, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [adminUser, setAdminUser] = useState<any>(null)

    useEffect(() => {
        const adminToken = localStorage.getItem('admin_token')
        const adminUserData = localStorage.getItem('admin_user')
        if (!adminToken) {
            router.push('/admin/login')
        } else {
            setIsAuthenticated(true)
            if (adminUserData) {
                setAdminUser(JSON.parse(adminUserData))
            }
        }
        setIsLoading(false)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        router.push('/admin/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">UniStudy Admin</h1>
                            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            {adminUser?.username || 'Admin'}
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-6 px-4">
                {children}
            </main>
        </div>
    )
}
