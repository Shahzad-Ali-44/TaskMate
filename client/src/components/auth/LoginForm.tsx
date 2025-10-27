import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Target, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { ThemeToggle } from '../../components/theme-toggle'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onLoginSuccess: () => void
  onForgotPassword: () => void
}

export function LoginForm({ onSwitchToSignup, onLoginSuccess, onForgotPassword }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const wasLoggedOut = sessionStorage.getItem('wasLoggedOut')
    if (wasLoggedOut === 'true') {
      setTimeout(() => {
        toast.success('Logged out successfully!', {
          duration: 4000,
          position: 'top-right'
        })
      }, 100)
      sessionStorage.removeItem('wasLoggedOut')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')


    try {
      const result = await login({ email, password })

      if (result.success) {
        const wasFromSignup = sessionStorage.getItem('wasFromSignup')
        if (!wasFromSignup) {
          toast.success('Welcome back!')
        }
        sessionStorage.removeItem('wasFromSignup')
        onLoginSuccess()
      } else {
        setError(result.error || 'Login failed')
        toast.error('Login failed')
      }
    } catch (error) {
      setError('An unexpected error occurred')
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
          },
        }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        
        <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
              <img src="/favicon.ico" alt="TaskMate Logo" className="w-12 h-12" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Sign in to your TaskMate account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4" name="login-form">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12"
                    required
                    autoComplete="email"
                    name="email"
                    id="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12"
                    required
                    autoComplete="off"
                    name="password"
                    id="password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-slate-600 dark:text-blue-400 hover:text-slate-700 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer"
                >
                  Sign up
                </button>
              </p>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 pb-2">
                <button
                  onClick={onForgotPassword}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}
