'use client'

import { useState } from 'react'
import { Bell, X, CheckCircle, Trophy, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Notification {
    id: string
    title: string
    message: string
    type: 'achievement' | 'streak' | 'quiz' | 'info'
    time: string
    read: boolean
}

export function NotificationsPopover() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Welcome to UniStudy!',
            message: 'Start your learning journey by enrolling in your first course',
            type: 'info',
            time: '2m ago',
            read: false,
        },
        {
            id: '2',
            title: '🔥 Streak Started!',
            message: 'You\'ve started your study streak. Keep it going!',
            type: 'streak',
            time: '1h ago',
            read: false,
        },
    ])

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'achievement':
                return <Trophy className="h-4 w-4 text-yellow-500" />
            case 'streak':
                return <Flame className="h-4 w-4 text-orange-500" />
            case 'quiz':
                return <CheckCircle className="h-4 w-4 text-cyan-400" />
            default:
                return <Bell className="h-4 w-4 text-cyan-400" />
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-cyan-400 rounded-full flex items-center justify-center text-[10px] font-bold text-background">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <Card className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-2rem)] sm:max-w-96 z-50 max-h-[calc(100vh-5rem)] sm:max-h-[500px] overflow-hidden flex flex-col shadow-2xl">
                        <CardHeader className="border-b border-border pb-3 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={markAllAsRead}
                                        className="text-xs h-8 px-2"
                                    >
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 sm:p-8 text-center text-muted-foreground">
                                    <Bell className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 sm:p-4 hover:bg-secondary/50 transition-colors ${!notification.read ? 'bg-cyan-400/5' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <div className="mt-1 flex-shrink-0">{getIcon(notification.type)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="font-medium text-sm leading-tight">
                                                            {notification.title}
                                                        </p>
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="text-muted-foreground hover:text-foreground flex-shrink-0 p-1 -m-1"
                                                        >
                                                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2 gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {notification.time}
                                                        </span>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-xs text-cyan-400 hover:underline whitespace-nowrap"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
