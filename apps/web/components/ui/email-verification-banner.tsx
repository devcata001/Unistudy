'use client'

import { useState } from 'react'
import { Button } from './button'
import { AlertCircle, X, Mail } from 'lucide-react'
import { authApi } from '@/lib/api'
import { toast } from 'sonner'

interface EmailVerificationBannerProps {
    userEmail: string
}

export function EmailVerificationBanner({ userEmail }: EmailVerificationBannerProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isResending, setIsResending] = useState(false)

    const handleResend = async () => {
        setIsResending(true)
        try {
            await authApi.resendVerification()
            toast.success('Verification email sent! Check your inbox.')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resend email')
        } finally {
            setIsResending(false)
        }
    }

    if (!isVisible) return null

    return (
        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6 relative">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="font-semibold text-sm">Verify Your Email</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Please verify your email address (<strong>{userEmail}</strong>) to access all features.
                        Check your inbox for the verification link.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={handleResend}
                        disabled={isResending}
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
