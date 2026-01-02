import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { KeepAliveProvider } from '@/providers/KeepAliveProvider'
import '@/styles/globals.css'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'UniStudy - AI-Powered Learning Platform for Nigerian Universities',
    description: 'Modern study platform for Nigerian university students with AI-powered assistance, smart quizzes, and collaborative learning.',
    icons: {
        icon: [
            { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
            { url: '/favicon.ico' },
        ],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body className={`${inter.className} antialiased`}>
                <QueryProvider>
                    <KeepAliveProvider>
                        <ToastProvider />
                        {children}
                    </KeepAliveProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
