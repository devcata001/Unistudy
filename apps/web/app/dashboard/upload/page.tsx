'use client'

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { materialsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, Image as ImageIcon, File, X, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UploadedFile {
    file: File
    preview?: string
    status: 'pending' | 'uploading' | 'success' | 'error'
}

export default function UploadFilesPage() {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [dragActive, setDragActive] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const droppedFiles = Array.from(e.dataTransfer.files)
        addFiles(droppedFiles)
    }, [])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files)
            addFiles(selectedFiles)
        }
    }

    const addFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter(file => {
            const validTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ]
            return validTypes.includes(file.type)
        })

        const uploadedFiles: UploadedFile[] = validFiles.map(file => {
            const uploaded: UploadedFile = {
                file,
                status: 'pending'
            }

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setFiles(prev => prev.map(f =>
                        f.file === file ? { ...f, preview: reader.result as string } : f
                    ))
                }
                reader.readAsDataURL(file)
            }

            return uploaded
        })

        setFiles(prev => [...prev, ...uploadedFiles])
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const response = await materialsApi.uploadFile(file)
            return response.data
        },
    })

    const handleUploadAll = async () => {
        for (let i = 0; i < files.length; i++) {
            if (files[i].status === 'pending') {
                setFiles(prev => prev.map((f, idx) =>
                    idx === i ? { ...f, status: 'uploading' } : f
                ))

                try {
                    await uploadMutation.mutateAsync(files[i].file)
                    setFiles(prev => prev.map((f, idx) =>
                        idx === i ? { ...f, status: 'success' } : f
                    ))
                } catch (error) {
                    setFiles(prev => prev.map((f, idx) =>
                        idx === i ? { ...f, status: 'error' } : f
                    ))
                }
            }
        }

        // If all successful, invalidate cache and redirect
        const allSuccess = files.every(f => f.status === 'success')
        if (allSuccess) {
            queryClient.invalidateQueries({ queryKey: ['materials', 'user'] })
            setTimeout(() => {
                router.push('/dashboard/materials')
            }, 1500)
        }
    }

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />
        if (type === 'application/pdf') return <FileText className="h-5 w-5" />
        return <File className="h-5 w-5" />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Upload className="h-8 w-8 text-cyan-400" />
                    Upload Study Materials
                </h1>
                <p className="text-muted-foreground mt-1">
                    Upload PDFs, images, and documents for AI-powered study assistance
                </p>
            </div>

            {/* Upload Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Files</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive
                            ? 'border-cyan-400 bg-cyan-400/5'
                            : 'border-border hover:border-cyan-400/50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">
                            Drag and drop files here
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            or click to browse
                        </p>
                        <Input
                            type="file"
                            multiple
                            accept=".pdf,.png,.jpg,.jpeg,.gif,.docx,.txt"
                            onChange={handleFileInput}
                            className="hidden"
                            id="file-input"
                        />
                        <Label htmlFor="file-input">
                            <Button type="button" variant="outline" asChild>
                                <span className="cursor-pointer">
                                    Browse Files
                                </span>
                            </Button>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-4">
                            Supported: PDF, Images (PNG, JPG, GIF), DOCX, TXT
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* File List */}
            {files.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Selected Files ({files.length})</CardTitle>
                            <Button
                                onClick={handleUploadAll}
                                disabled={files.every(f => f.status !== 'pending')}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {files.map((uploadedFile, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 border border-border rounded-lg"
                                >
                                    {uploadedFile.preview ? (
                                        <img
                                            src={uploadedFile.preview}
                                            alt={uploadedFile.file.name}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 flex items-center justify-center bg-secondary rounded">
                                            {getFileIcon(uploadedFile.file.type)}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {uploadedFile.file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(uploadedFile.file.size)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {uploadedFile.status === 'uploading' && (
                                            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                                        )}
                                        {uploadedFile.status === 'success' && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                        {uploadedFile.status === 'error' && (
                                            <X className="h-5 w-5 text-red-500" />
                                        )}
                                        {uploadedFile.status === 'pending' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
