import { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.tsx'
import apiClient from './lib/api.ts'
import type { Todo } from './types'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { CheckCircle2, Plus, Trash2, Target, TrendingUp, Clock, Zap, Code, LogOut, User } from 'lucide-react'
import { ThemeToggle } from './components/theme-toggle'
import { LoginForm } from './components/auth/LoginForm'
import { SignupForm } from './components/auth/SignupForm'
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm'
import toast, { Toaster } from 'react-hot-toast'

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  useEffect(() => {
    if (user) {
      fetchTodos()
    } else {
      setTodos([])
      setShowLogin(true)
      setShowForgotPassword(false)
    }
  }, [user])

  const fetchTodos = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await apiClient.getTasks()
      if (response.success) {
        setTodos(response.data.tasks)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim() || !user) return

    setLoading(true)
    try {
      const response = await apiClient.createTask({ title: newTodo })
      if (response.success) {
        setTodos([response.data.task, ...todos])
        setNewTodo('')
        toast.success('Task added!')
      }
    } catch (error) {
      console.error('Add error:', error)
      toast.error('Failed to add task')
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id: string, isComplete: boolean) => {
    try {
      const response = await apiClient.updateTask(id, { isComplete: !isComplete })
      if (response.success) {
        const newTodos = todos.map(todo =>
          todo._id === id ? { ...todo, isComplete: !isComplete } : todo
        )
        setTodos(newTodos)

        const newCompletedCount = newTodos.filter(t => t.isComplete).length
        const newTotalCount = newTodos.length

        if (!isComplete && newCompletedCount === newTotalCount && newTotalCount > 0) {
          toast.success('All tasks completed. Great job!', {
            duration: 4000
          })
        } else {
          toast.success(isComplete ? 'Task marked as incomplete 🔄' : 'Task completed!')
        }
      }
    } catch (error) {
      console.error('Toggle error:', error)
      toast.error('Failed to update task')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await apiClient.deleteTask(id)
      if (response.success) {
        setTodos(todos.filter(todo => todo._id !== id))
        toast.success('Task deleted successfully! 🗑️')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete task')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const handleLogout = async () => {
    sessionStorage.setItem('wasLoggedOut', 'true')
    setShowLogin(true)
    await logout()
  }



  const completedCount = todos.filter(t => t.isComplete).length
  const totalCount = todos.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0



  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }


  if (!user) {
    if (showForgotPassword) {
      return (
        <ForgotPasswordForm
          onBackToLogin={() => {
            setShowForgotPassword(false)
            setShowLogin(true)
          }}
        />
      )
    }

    return showLogin ? (
      <LoginForm
        onSwitchToSignup={() => setShowLogin(false)}
        onLoginSuccess={() => { }}
        onForgotPassword={() => {
          setShowForgotPassword(true)
          setShowLogin(false)
        }}
      />
    ) : (
      <SignupForm
        onSwitchToLogin={() => setShowLogin(true)}
        onSignupSuccess={() => { }}
      />
    )
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Welcome, {user.name || user.email}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl shadow-blue-500/25 hover:scale-110 transition-transform duration-300">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              TaskMate
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Your personal task companion
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(progressPercentage)}%</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What's your next focus?"
                    className="h-12 text-lg border-0 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={addTodo}
                  disabled={loading || !newTodo.trim()}
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Add Task</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {totalCount > 0 && (
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900 dark:text-white">Your Progress</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {completedCount}/{totalCount} completed
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {progressPercentage === 100 ? (
                    <span className="text-green-600 dark:text-green-400">All tasks completed. Amazing work!</span>
                  ) : (
                    <span>Keep going! You're making great progress.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Your Focus Tasks</span>
              </CardTitle>
              <CardDescription>
                {totalCount === 0 ? "Add your first task to get started" : `${totalCount} task${totalCount !== 1 ? 's' : ''} in your list`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading && todos.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading your focus tasks...</p>
                </div>
              ) : todos.length === 0 ? (
                <div className="p-12 text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No tasks yet</h3>
                  <p className="text-slate-600 dark:text-slate-400">Add your first focus item above to get started!</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500">
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {todos.map((todo, index) => (
                      <div
                        key={todo._id}
                        className={`p-6 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${todo.isComplete ? 'opacity-75' : ''
                          }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComplete(todo._id, todo.isComplete)}
                            className={`w-10 h-10 rounded-full p-0 transition-all duration-200 ${todo.isComplete
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                              }`}
                          >
                            {todo.isComplete && <CheckCircle2 className="w-5 h-5" />}
                          </Button>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-lg font-medium transition-all duration-200 ${todo.isComplete
                                ? 'text-slate-500 dark:text-slate-400 line-through'
                                : 'text-slate-900 dark:text-white'
                                }`}
                            >
                              {todo.title}
                            </p>
                            {todo.isComplete && (
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Completed
                              </p>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(todo._id)}
                            className="w-10 h-10 rounded-full p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 w-full">
        <div className="w-full px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  TaskMate
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Your personal task companion. The ultimate productivity app designed to help you stay organized and accomplish your goals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                <ThemeToggle />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Features</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Task Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Progress Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Real-time Sync</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Dark Mode</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Responsive Design</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Productivity Tips</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Break tasks into smaller chunks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Focus on one task at a time</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Track your progress daily</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Celebrate small wins</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Stay consistent with your goals</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Connect</h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>hello@taskmate.app</span>
                </p>
                <p className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Follow us on LinkedIn</span>
                </p>
                <p className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Get support</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 px-4">
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <span>© {new Date().getFullYear()} TaskMate. All rights reserved.</span>
                <span>•</span>
                <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <span>Developed with</span>
                <Code className="h-4 w-4 text-blue-700 dark:text-blue-400 animate-pulse" />
                <span>by</span>
                <a
                  href="https://shahzadali.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Shahzad Ali
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
