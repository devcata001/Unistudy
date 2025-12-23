'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { aiApi, type AiMessage } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, Send, User, Plus, Trash2 } from 'lucide-react'

export default function AiTutorPage() {
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<AiMessage[]>([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI tutor. I can help you with:\n\n• Explain complex topics in simple terms\n• Solve problems step-by-step\n• Provide study tips and exam strategies\n• Answer questions about any subject\n\nJust ask me anything!',
        },
    ])
    const [input, setInput] = useState('')
    const [streamingMessage, setStreamingMessage] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, streamingMessage])

    // Function to start a new chat
    const startNewChat = () => {
        setConversationId(null)
        setMessages([
            {
                role: 'assistant',
                content: 'Hello! I\'m your AI tutor. I can help you with:\n\n• Explain complex topics in simple terms\n• Solve problems step-by-step\n• Provide study tips and exam strategies\n• Answer questions about any subject\n\nJust ask me anything!',
            },
        ])
        setInput('')
        setStreamingMessage('')
    }

    // Function to simulate streaming by displaying text progressively
    const streamText = (text: string) => {
        setIsStreaming(true)
        setStreamingMessage('')

        const words = text.split(' ')
        let currentIndex = 0

        const interval = setInterval(() => {
            if (currentIndex < words.length) {
                setStreamingMessage(prev => prev + (prev ? ' ' : '') + words[currentIndex])
                currentIndex++
            } else {
                clearInterval(interval)
                setIsStreaming(false)
                setMessages(prev => [...prev, { role: 'assistant', content: text }])
                setStreamingMessage('')
            }
        }, 50) // Adjust speed here (50ms per word)

        return () => clearInterval(interval)
    }

    const askMutation = useMutation({
        mutationFn: (question: string) => aiApi.ask(question, conversationId || undefined),
        onSuccess: (response: any) => {
            // Store conversation ID for memory
            if (response.data.conversationId) {
                setConversationId(response.data.conversationId)
            }
            streamText(response.data.answer)
            // Dispatch event for dashboard stats
            window.dispatchEvent(new Event('questionAsked'))
        },
        onError: () => {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ])
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || askMutation.isPending || isStreaming) return

        const userMessage: AiMessage = {
            role: 'user',
            content: input,
        }

        setMessages((prev) => [...prev, userMessage])
        askMutation.mutate(input)
        setInput('')
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">AI Tutor</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Get instant help with your studies
                    </p>
                </div>
                <Button
                    onClick={startNewChat}
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                </Button>
            </div>

            {/* Chat Card */}
            <Card className="flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)]">
                <CardHeader className="border-b border-border py-3 sm:py-4">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-cyan-400" />
                            <span className="text-base sm:text-lg">Chat with AI Tutor</span>
                        </div>
                        {messages.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={startNewChat}
                                className="text-xs sm:text-sm"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${message.role === 'user'
                                    ? 'bg-cyan-400 text-background'
                                    : 'bg-secondary text-foreground'
                                    }`}
                            >
                                {message.role === 'assistant' ? (
                                    <div
                                        className="text-xs sm:text-sm prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground"
                                        dangerouslySetInnerHTML={{ __html: message.content }}
                                    />
                                ) : (
                                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Streaming message */}
                    {isStreaming && streamingMessage && (
                        <div className="flex gap-2 sm:gap-3 justify-start">
                            <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                            </div>
                            <div className="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-secondary">
                                <div
                                    className="text-xs sm:text-sm prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground"
                                    dangerouslySetInnerHTML={{ __html: streamingMessage + '<span class="animate-pulse">▊</span>' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Loading indicator */}
                    {askMutation.isPending && !isStreaming && (
                        <div className="flex gap-2 sm:gap-3 justify-start">
                            <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                            </div>
                            <div className="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-secondary">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Form */}
                <div className="p-3 sm:p-4 border-t border-border">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={askMutation.isPending || isStreaming}
                            className="flex-1 text-sm sm:text-base"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || askMutation.isPending || isStreaming}
                            className="flex-shrink-0"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}
