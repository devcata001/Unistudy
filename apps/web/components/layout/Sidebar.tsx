'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    FileText,
    Bot,
    Sparkles,
    Upload,
    CreditCard,
    GraduationCap,
    BookOpen,
    Trophy,
    Settings,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Quizzes', href: '/dashboard/quizzes', icon: Trophy },
    { name: 'Study Materials', href: '/dashboard/materials', icon: FileText },
    { name: 'Upload Files', href: '/dashboard/upload', icon: Upload },
    { name: 'Generate Manual', href: '/dashboard/generate-manual', icon: Sparkles },
    { name: 'Flashcards', href: '/dashboard/flashcards', icon: CreditCard },
    { name: 'AI Tutor', href: '/dashboard/ai-tutor', icon: Bot },
    { name: 'Manage Courses', href: '/dashboard/courses/manage', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
            {/* Logo */}
            <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
                <GraduationCap className="h-8 w-8 text-cyan-400" />
                <div>
                    <h1 className="font-bold text-lg">UniStudy</h1>
                    <p className="text-xs text-muted-foreground">Learn Smarter</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-cyan-400/10 text-cyan-400'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
