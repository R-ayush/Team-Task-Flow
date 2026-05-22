import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const priorityVariant = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
const statusVariant = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' }
const statusLabel = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboard = async () => {
    await Promise.resolve()
    try {
      setIsLoading(prev => !prev ? true : prev)
      const res = await axiosInstance.get('/dashboard')
      const data = res.data.data
      setStats({
        totalTasks: data.totalTasks || 0,
        inProgress: data.tasksByStatus?.IN_PROGRESS || 0,
        done: data.tasksByStatus?.DONE || 0,
        overdue: data.overdueTasks || 0,
      })
      setTasks(data.myAssignedTasks || [])
    } catch {
      setStats({ totalTasks: 0, inProgress: 0, done: 0, overdue: 0 })
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard()
  }, [])


  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: ListTodo,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      gradient: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
    },
    {
      title: 'Completed',
      value: stats?.done || 0,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-rose-500',
      bg: 'bg-red-500/10',
      iconColor: 'text-red-400',
    },
  ]

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isOverdue = (dateString) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back,{' '}
            <span className="text-gradient">{user?.name || 'User'}</span>
          </h1>
          <p className="text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your tasks today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
              </Card>
            ))
          : statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={stat.title}
                  className="group relative overflow-hidden hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient accent line at top */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 font-medium">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-white mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* My Tasks Section */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10">
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <CardTitle>My Tasks</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                <ListTodo className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">
                No tasks assigned to you yet
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Tasks will appear here once assigned
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-white/[0.06]">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {tasks.map((task, index) => (
                    <tr
                      key={task.id || index}
                      className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">
                          {task.title}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <Link
                          to={`/projects/${task.project?.id || task.project_id}`}
                          className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                        >
                          {task.project?.name || 'Unknown Project'}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={priorityVariant[task.priority] || 'default'}
                        >
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={statusVariant[task.status] || 'default'}
                        >
                          {statusLabel[task.status] || task.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span
                          className={`text-sm ${
                            isOverdue(task.due_date) && task.status !== 'DONE'
                              ? 'text-red-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {formatDate(task.due_date)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
