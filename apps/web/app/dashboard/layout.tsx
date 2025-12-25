'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    // Check if this is an admin route
    const isAdminRoute = pathname?.startsWith('/dashboard/admin')

    useEffect(() => {
        // Skip auth check for admin routes (they have their own layout)
        if (isAdminRoute) return

        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router, isAdminRoute])

    // For admin routes, skip the loading and auth checks (admin layout handles it)
    if (isAdminRoute) {
        return <>{children}</>
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
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
            <Sidebar />
            <div className="lg:pl-64">
                <Navbar />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
