import { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.tsx'
import apiClient from './lib/api.ts'
import type { Todo } from './types'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { CheckCircle2, Plus, Trash2, TrendingUp, Zap, LogOut, User, Circle, Play, Search, Star } from 'lucide-react'
import { ThemeToggle } from './components/theme-toggle'
import { LoginForm } from './components/auth/LoginForm'
import { SignupForm } from './components/auth/SignupForm'
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm'
import toast, { Toaster } from 'react-hot-toast'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type TaskStatus = 'pending' | 'ongoing' | 'completed'
type TaskPriority = 'low' | 'medium' | 'high'

interface Task extends Todo {
  status: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}
function SortableTaskItem({ task, onToggle, onDelete }: { 
  task: Task
  onToggle: (id: string, isComplete: boolean) => void
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getStatusColor = () => {
    switch (task.status) {
      case 'pending': return 'border-l-slate-400'
      case 'ongoing': return 'border-l-blue-500'
      case 'completed': return 'border-l-green-500'
    }
  }

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-slate-400'
    }
  }

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high': return <Star className="w-3 h-3 fill-current" />
      case 'medium': return <Star className="w-3 h-3" />
      case 'low': return <Star className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${getStatusColor()} border-l-4 rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing select-none transition-all duration-200 hover:shadow-sm active:scale-[0.98]`}
    >
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onToggle(task._id, task.isComplete)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`w-9 h-9 rounded-full p-0 transition-all duration-200 ${
            task.isComplete
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          {task.isComplete && <CheckCircle2 className="w-4 h-4" />}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p
              className={`text-sm font-medium transition-all duration-200 ${
                task.isComplete
                  ? 'text-slate-400 dark:text-slate-500 line-through'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </p>
            {task.priority && (
              <div className={`${getPriorityColor()}`}>
                {getPriorityIcon()}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task._id)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-9 h-9 rounded-full p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function TaskColumn({ 
  title, 
  tasks, 
  status, 
  onToggle, 
  onDelete,
  searchQuery,
  onSearchChange
}: { 
  title: string
  tasks: Task[]
  status: TaskStatus
  onToggle: (id: string, isComplete: boolean) => void
  onDelete: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const getHeaderColor = () => {
    switch (status) {
      case 'pending': return 'text-slate-600 dark:text-slate-400'
      case 'ongoing': return 'text-blue-600 dark:text-blue-400'
      case 'completed': return 'text-green-600 dark:text-green-400'
    }
  }

  const getBadgeColor = () => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      case 'ongoing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    }
  }

  return (
    <Card 
      ref={setNodeRef}
      className={`bg-white dark:bg-slate-800 border-2 transition-all duration-200 rounded-xl overflow-hidden ${
        isOver 
          ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg' 
          : 'border-slate-200 dark:border-slate-700 shadow-sm'
      }`}
    >
      <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 px-4 pt-4">
        <CardTitle className={`text-sm font-semibold flex items-center space-x-2 ${getHeaderColor()}`}>
          {status === 'pending' && <Circle className="w-5 h-5" />}
          {status === 'ongoing' && <Play className="w-5 h-5" />}
          {status === 'completed' && <CheckCircle2 className="w-5 h-5" />}
          <span className="uppercase tracking-wide">{title}</span>
          <Badge variant="secondary" className={`ml-auto ${getBadgeColor()}`}>
            {tasks.length}
          </Badge>
        </CardTitle>
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-10 h-8 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-4 px-4">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div className="min-h-[200px]">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                {status === 'pending' && <Circle className="w-12 h-12 mb-3 opacity-20" />}
                {status === 'ongoing' && <Play className="w-12 h-12 mb-3 opacity-20" />}
                {status === 'completed' && <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />}
                <p className="text-sm font-medium">
                  {isOver ? 'Drop task here' : 'No tasks yet'}
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <SortableTaskItem
                  key={task._id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  )
}

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [searchQueries, setSearchQueries] = useState<{
    pending: string
    ongoing: string
    completed: string
  }>({
    pending: '',
    ongoing: '',
    completed: ''
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    if (user) {
      fetchTasks()
    } else {
      setTasks([])
      setShowLogin(true)
      setShowForgotPassword(false)
    }
  }, [user])

  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await apiClient.getTasks()
      if (response.success) {
        const tasksWithStatus: Task[] = response.data.tasks.map((todo: Todo) => ({
          ...todo,
          status: todo.isComplete ? 'completed' : 'pending' as TaskStatus
        }))
        setTasks(tasksWithStatus)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.trim() || !user) return

    setLoading(true)
    try {
      const response = await apiClient.createTask({ title: newTask })
      if (response.success) {
        const newTaskWithStatus: Task = {
          ...response.data.task,
          status: 'pending' as TaskStatus
        }
        setTasks([newTaskWithStatus, ...tasks])
        setNewTask('')
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
        const newTasks = tasks.map(task =>
          task._id === id 
            ? { ...task, isComplete: !isComplete, status: (!isComplete ? 'completed' : 'pending') as TaskStatus }
            : task
        )
        setTasks(newTasks)

        const newCompletedCount = newTasks.filter(t => t.isComplete).length
        const newTotalCount = newTasks.length

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

  const deleteTask = async (id: string) => {
    try {
      const response = await apiClient.deleteTask(id)
      if (response.success) {
        setTasks(tasks.filter(task => task._id !== id))
        toast.success('Task deleted successfully! 🗑️')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete task')
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(task => task._id === activeId)
    if (!activeTask) return

    let newStatus: TaskStatus = activeTask.status
    
    if (overId === 'pending' || overId === 'ongoing' || overId === 'completed') {
      newStatus = overId as TaskStatus
    } else {
      const overTask = tasks.find(task => task._id === overId)
      if (overTask) {
        newStatus = overTask.status
      }
    }

    if (newStatus !== activeTask.status) {
      const newTasks = tasks.map(task =>
        task._id === activeId 
          ? { 
              ...task, 
              status: newStatus,
              isComplete: newStatus === 'completed'
            }
          : task
      )
      setTasks(newTasks)

      apiClient.updateTask(activeId, { isComplete: newStatus === 'completed' })
        .then(() => {
          toast.success(`Task moved to ${newStatus}!`)
        })
        .catch(error => {
          console.error('Update error:', error)
          toast.error('Failed to update task status')
          setTasks(tasks)
        })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const handleLogout = async () => {
    sessionStorage.setItem('wasLoggedOut', 'true')
    setShowLogin(true)
    await logout()
  }

  const pendingTasks = tasks.filter(t => 
    t.status === 'pending' && 
    t.title.toLowerCase().includes(searchQueries.pending.toLowerCase())
  )
  const ongoingTasks = tasks.filter(t => 
    t.status === 'ongoing' && 
    t.title.toLowerCase().includes(searchQueries.ongoing.toLowerCase())
  )
  const completedTasks = tasks.filter(t => 
    t.status === 'completed' && 
    t.title.toLowerCase().includes(searchQueries.completed.toLowerCase())
  )

  const totalCount = tasks.length
  const completedCount = completedTasks.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src="/favicon.ico" alt="TaskMate Logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">TaskMate</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Welcome back, <span className="font-medium text-slate-700 dark:text-slate-300">{user.name || user.email}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Tasks</span>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</span>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Progress</span>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200 dark:text-slate-700"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-purple-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${progressPercentage}, 100`}
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{Math.round(progressPercentage)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{completedCount}/{totalCount}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">tasks done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6 rounded-xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new task..."
                    className="h-12 text-base border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:border-blue-400 dark:focus:border-blue-500 transition-colors duration-200"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={addTask}
                  disabled={loading || !newTask.trim()}
                  className="h-12 px-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TaskColumn
                title="Pending"
                tasks={pendingTasks}
                status="pending"
                onToggle={toggleComplete}
                onDelete={deleteTask}
                searchQuery={searchQueries.pending}
                onSearchChange={(query) => setSearchQueries(prev => ({ ...prev, pending: query }))}
              />
              <TaskColumn
                title="Ongoing"
                tasks={ongoingTasks}
                status="ongoing"
                onToggle={toggleComplete}
                onDelete={deleteTask}
                searchQuery={searchQueries.ongoing}
                onSearchChange={(query) => setSearchQueries(prev => ({ ...prev, ongoing: query }))}
              />
              <TaskColumn
                title="Completed"
                tasks={completedTasks}
                status="completed"
                onToggle={toggleComplete}
                onDelete={deleteTask}
                searchQuery={searchQueries.completed}
                onSearchChange={(query) => setSearchQueries(prev => ({ ...prev, completed: query }))}
              />
            </div>
            
            <DragOverlay>
              {activeId ? (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-lg">
                  {tasks.find(t => t._id === activeId)?.title}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
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