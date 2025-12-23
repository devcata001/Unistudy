'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoggingIn, loginError, isAuthenticated } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard')
        }
    }, [isAuthenticated, router])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login(formData)
    }

    const errorMessage = (loginError as any)?.response?.data?.message || loginError?.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-cyan-400/10">
                            <GraduationCap className="h-8 w-8 text-cyan-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to continue your learning journey
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {errorMessage && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{errorMessage}</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@university.edu.ng"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isLoggingIn}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={isLoggingIn}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-cyan-400 hover:text-cyan-500 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="text-cyan-400 hover:text-cyan-500 font-medium transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
