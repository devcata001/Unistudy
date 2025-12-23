import Link from 'next/link'
import { GraduationCap, Bot, Trophy, Users } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
            {/* Navbar */}
            <nav className="border-b border-border/50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-cyan-400" />
                        <span className="text-xl font-bold">UniStudy</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/login" className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="px-6 py-2 bg-cyan-400 text-background rounded-lg font-medium hover:bg-cyan-500 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl md:text-6xl font-bold">
                        Your AI-Powered
                        <br />
                        <span className="text-gradient">Learning Companion</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Study smarter with AI assistance, personalized quizzes, and collaborative learning tools built for Nigerian university students.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/register" className="px-8 py-3 bg-cyan-400 text-background rounded-lg font-medium hover:bg-cyan-500 transition-colors text-lg">
                            Start Learning Free
                        </Link>
                        <Link href="/login" className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors text-lg">
                            Sign In
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-20">
                        <div className="p-6 rounded-xl bg-card border border-border">
                            <Bot className="h-12 w-12 text-cyan-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">AI Tutor</h3>
                            <p className="text-muted-foreground">
                                Get instant help from our AI assistant trained on your course materials.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border">
                            <Trophy className="h-12 w-12 text-cyan-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Smart Quizzes</h3>
                            <p className="text-muted-foreground">
                                AI-generated quizzes that adapt to your learning progress and weak topics.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border">
                            <Users className="h-12 w-12 text-cyan-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                            <p className="text-muted-foreground">
                                Monitor your study sessions, scores, and improvement over time.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
