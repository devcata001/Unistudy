'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { universitiesApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, AlertCircle, Eye, EyeOff, CheckCircle2, X, Search } from 'lucide-react'

const departments = [
    // Engineering
    'Computer Science',
    'Computer Engineering',
    'Software Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Petroleum Engineering',
    'Agricultural Engineering',
    'Aerospace Engineering',
    'Industrial Engineering',
    'Mechatronics Engineering',
    'Marine Engineering',
    'Systems Engineering',

    // Sciences
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Microbiology',
    'Biochemistry',
    'Botany',
    'Zoology',
    'Geology',
    'Geophysics',
    'Statistics',
    'Industrial Chemistry',
    'Pure and Applied Chemistry',

    // Medical Sciences
    'Medicine and Surgery',
    'Nursing',
    'Medical Laboratory Science (MLS)',
    'Anatomy',
    'Physiology',
    'Pharmacology',
    'Pharmacy',
    'Dentistry',
    'Optometry',
    'Radiography',
    'Public Health',

    // Technology & IT
    'Cyber Security',
    'Information Technology',
    'Data Science',
    'Artificial Intelligence',
    'Information Systems',

    // Social Sciences
    'Economics',
    'Accounting',
    'Business Administration',
    'Political Science',
    'Sociology',
    'Psychology',
    'Mass Communication',
    'Public Administration',
    'International Relations',

    // Arts & Humanities
    'English Language',
    'Law',
    'History',
    'Philosophy',
    'Religious Studies',
    'Linguistics',
    'French',
    'Arabic',

    // Environmental Sciences
    'Environmental Science',
    'Architecture',
    'Estate Management',
    'Urban and Regional Planning',
    'Quantity Surveying',
    'Building Technology',

    // Agriculture
    'Agricultural Economics',
    'Animal Science',
    'Crop Science',
    'Fisheries',
    'Forestry',
    'Soil Science',

    // Education
    'Education and Economics',
    'Education and English',
    'Education and Mathematics',
    'Education and Biology',
    'Education and Chemistry',
    'Education and Physics',
]

const levels = [100, 200, 300, 400, 500]

export default function RegisterPage() {
    const { register, isRegistering, registerError } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        university: '',
        department: '',
        level: 100,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [universitySearch, setUniversitySearch] = useState('')
    const [showUniversityDropdown, setShowUniversityDropdown] = useState(false)

    // Fetch universities
    const { data: universitiesData } = useQuery({
        queryKey: ['universities'],
        queryFn: async () => {
            const response = await universitiesApi.getAll()
            return response.data
        },
    })

    // Filter universities based on search
    const filteredUniversities = universitiesData?.universities.filter(uni =>
        uni.name.toLowerCase().includes(universitySearch.toLowerCase()) ||
        uni.acronym?.toLowerCase().includes(universitySearch.toLowerCase())
    ) || []

    // Password strength validation
    const validatePasswordStrength = (password: string) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        }
        return checks
    }

    const passwordChecks = validatePasswordStrength(formData.password)
    const isPasswordStrong = Object.values(passwordChecks).every(Boolean)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        const newErrors: Record<string, string> = {}

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!isPasswordStrong) {
            newErrors.password = 'Password does not meet strength requirements'
        }

        if (!formData.university) {
            newErrors.university = 'Please select your university'
        }

        if (!formData.department) {
            newErrors.department = 'Please enter your department'
        }

        if (!formData.level) {
            newErrors.level = 'Please select your level'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        const { confirmPassword, ...registerData } = formData
        register(registerData)
    }

    const errorMessage = (registerError as any)?.response?.data?.message || registerError?.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4 py-12">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-cyan-400/10">
                            <GraduationCap className="h-8 w-8 text-cyan-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Create Your Account</CardTitle>
                    <CardDescription>
                        Join UniStudy - Learning platform for Nigerian university students
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium">
                                    First Name
                                </label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                    disabled={isRegistering}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium">
                                    Last Name
                                </label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                    disabled={isRegistering}
                                />
                            </div>
                        </div>

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
                                disabled={isRegistering}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="university" className="text-sm font-medium">
                                University
                            </label>
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="university"
                                        placeholder="Type or search your university..."
                                        value={universitySearch}
                                        onChange={(e) => {
                                            setUniversitySearch(e.target.value)
                                            setFormData({ ...formData, university: e.target.value })
                                            setShowUniversityDropdown(true)
                                        }}
                                        onFocus={() => setShowUniversityDropdown(true)}
                                        onBlur={() => {
                                            // Delay to allow click on dropdown
                                            setTimeout(() => setShowUniversityDropdown(false), 200)
                                        }}
                                        required
                                        disabled={isRegistering}
                                        className="pl-10"
                                    />
                                </div>

                                {showUniversityDropdown && universitySearch && filteredUniversities.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-background border rounded-md shadow-lg">
                                        {filteredUniversities.slice(0, 50).map((uni) => (
                                            <button
                                                key={uni.name}
                                                type="button"
                                                className="w-full px-3 py-2 text-left hover:bg-accent text-sm"
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    setFormData({ ...formData, university: uni.name })
                                                    setUniversitySearch(uni.name)
                                                    setShowUniversityDropdown(false)
                                                }}
                                            >
                                                <div className="font-medium">{uni.acronym || uni.name}</div>
                                                {uni.acronym && <div className="text-xs text-muted-foreground">{uni.name}</div>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.university && (
                                <p className="text-xs text-destructive">{errors.university}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Type your university name or select from {universitiesData?.count || 0} Nigerian universities
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="department" className="text-sm font-medium">
                                    Department
                                </label>
                                <Input
                                    id="department"
                                    placeholder="e.g. Computer Science"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    required
                                    disabled={isRegistering}
                                />
                                {errors.department && (
                                    <p className="text-xs text-destructive">{errors.department}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="level" className="text-sm font-medium">
                                    Level
                                </label>
                                <select
                                    id="level"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                    disabled={isRegistering}
                                >
                                    {levels.map((level) => (
                                        <option key={level} value={level}>
                                            {level} Level
                                        </option>
                                    ))}
                                </select>
                                {errors.level && (
                                    <p className="text-xs text-destructive">{errors.level}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={isRegistering}
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

                            {/* Password Strength Indicators */}
                            {formData.password && (
                                <div className="space-y-2 mt-3">
                                    <div className="text-xs font-medium">Password must contain:</div>
                                    <div className="space-y-1">
                                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordChecks.length ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                            At least 8 characters
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordChecks.uppercase ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                            One uppercase letter
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordChecks.lowercase ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                            One lowercase letter
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordChecks.number ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                            One number
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.special ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordChecks.special ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                            One special character (!@#$%^&*)
                                        </div>
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    disabled={isRegistering}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isRegistering}
                        >
                            {isRegistering ? 'Creating account...' : 'Create Account'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-cyan-400 hover:text-cyan-500 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
