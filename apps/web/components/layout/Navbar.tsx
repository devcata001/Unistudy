'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X, GraduationCap } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { NotificationsPopover } from './NotificationsPopover'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
    const { user, logout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                    {/* Mobile: Logo + Menu Button */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            className="p-2 -ml-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-cyan-400" />
                            <span className="font-bold">UniStudy</span>
                        </div>
                    </div>

                    {/* Desktop: Empty div for spacing */}
                    <div className="hidden lg:block" />

                    {/* Right Side */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Notifications */}
                        <NotificationsPopover />

                        {/* User Avatar */}
                        <Link href="/dashboard/profile" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-cyan-400/10 flex items-center justify-center">
                                <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </span>
                            </Avatar>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {user?.department}
                                </p>
                            </div>
                        </Link>

                        {/* Logout - Hidden on mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => logout()}
                            title="Logout"
                            className="hidden sm:flex"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <nav className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border p-4 space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/materials"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Study Materials
                        </Link>
                        <Link
                            href="/dashboard/upload"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Upload Files
                        </Link>
                        <Link
                            href="/dashboard/generate-manual"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Generate Manual
                        </Link>
                        <Link
                            href="/dashboard/flashcards"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Flashcards
                        </Link>
                        <Link
                            href="/dashboard/ai-tutor"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            AI Tutor
                        </Link>

                        {/* Mobile Logout */}
                        <button
                            onClick={() => {
                                logout()
                                setMobileMenuOpen(false)
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary w-full text-left text-red-500"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </nav>
                </div>
            )}
        </>
    )
}
