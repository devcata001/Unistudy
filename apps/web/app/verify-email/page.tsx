'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { authApi } from '@/lib/api'

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Invalid verification link')
            return
        }

        verifyEmail()
    }, [token])

    const verifyEmail = async () => {
        try {
            const response = await authApi.verifyEmail(token!)
            setStatus('success')
            setMessage(response.data.message || 'Email verified successfully!')

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)
        } catch (error: any) {
            setStatus('error')
            setMessage(error.response?.data?.message || 'Verification failed. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        {status === 'loading' && (
                            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === 'loading' && 'Verifying Your Email'}
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </CardTitle>
                    <CardDescription>
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'success' && (
                        <div className="text-center text-sm text-muted-foreground">
                            Redirecting to dashboard in 3 seconds...
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push('/login')}
                            >
                                Back to Login
                            </Button>
                            <Button
                                variant="default"
                                className="w-full"
                                onClick={() => router.push('/dashboard')}
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
