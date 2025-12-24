import Link from 'next/link'
import { GraduationCap, Bot, Trophy, Users } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
            {/* Navbar */}
            <nav className="border-b border-border/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
                        <span className="text-lg sm:text-xl font-bold">UniStudy</span>
                    </div>
                    <div className="flex gap-2 sm:gap-4">
                        <Link href="/login" className="px-3 py-2 sm:px-4 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="px-4 py-2 sm:px-6 text-sm sm:text-base bg-cyan-400 text-background rounded-lg font-medium hover:bg-cyan-500 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        Your AI-Powered
                        <br />
                        <span className="text-gradient">Learning Companion</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                        Study smarter with AI assistance, personalized quizzes, and collaborative learning tools built for Nigerian university students.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                        <Link href="/register" className="px-6 sm:px-8 py-3 bg-cyan-400 text-background rounded-lg font-medium hover:bg-cyan-500 transition-colors text-base sm:text-lg">
                            Start Learning Free
                        </Link>
                        <Link href="/login" className="px-6 sm:px-8 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors text-base sm:text-lg">
                            Sign In
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20">
                        <div className="p-6 rounded-xl bg-card border border-border text-left">
                            <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400 mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">AI Tutor</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                Get instant help from our AI assistant trained on your course materials.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border text-left">
                            <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400 mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">Smart Quizzes</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                AI-generated quizzes that adapt to your learning progress and weak topics.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border text-left sm:col-span-2 md:col-span-1">
                            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400 mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">Track Progress</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                Monitor your study sessions, scores, and improvement over time.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

