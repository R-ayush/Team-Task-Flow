import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { Avatar, AvatarFallback } from '../components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/Dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/Select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../components/ui/DropdownMenu'
import { Separator } from '../components/ui/Separator'
import {
  Settings,
  Plus,
  MoreVertical,
  Trash2,
  Edit3,
  Calendar,
  LayoutGrid,
  Table,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = [
  { value: 'TODO', label: 'To Do', variant: 'todo' },
  { value: 'IN_PROGRESS', label: 'In Progress', variant: 'in_progress' },
  { value: 'DONE', label: 'Done', variant: 'done' },
]

const PRIORITIES = [
  { value: 'HIGH', label: 'High', variant: 'high' },
  { value: 'MEDIUM', label: 'Medium', variant: 'medium' },
  { value: 'LOW', label: 'Low', variant: 'low' },
]

const priorityVariant = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
const statusVariant = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}
const statusLabel = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const TaskCard = ({ task, isAdmin, onEditTask, onStatusChange, onDeleteConfirm }) => (
  <Card className="group hover:border-white/[0.15] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-2">
        <h4
          className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors cursor-pointer"
          onClick={() => onEditTask(task)}
        >
          {task.title}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUSES.map((s) => (
              <DropdownMenuItem
                key={s.value}
                onClick={() => onStatusChange(task.id, s.value)}
                className={
                  task.status === s.value ? 'bg-primary-500/10' : ''
                }
              >
                {s.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditTask(task)}>
              <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem
                className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                onClick={() => onDeleteConfirm(task.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {task.description && (
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-3">
        <Badge
          variant={priorityVariant[task.priority] || 'default'}
          className="text-[10px]"
        >
          {task.priority}
        </Badge>
        <div className="flex items-center gap-2">
          {task.due_date && (
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(task.due_date)}
            </span>
          )}
          {(task.assigned_to?.name || task.assigned_to) && (
            <Avatar className="w-6 h-6 ring-1">
              <AvatarFallback className="text-[10px]">
                {getInitials(task.assigned_to?.name || '')}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

const KanbanColumn = ({ title, variant, taskList, count, isAdmin, onEditTask, onStatusChange, onDeleteConfirm }) => (
  <div className="flex-1 min-w-[280px]">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Badge variant={variant}>{title}</Badge>
        <span className="text-xs text-slate-500 font-medium">{count}</span>
      </div>
    </div>
    <div className="space-y-3">
      {taskList.length === 0 ? (
        <div className="border border-dashed border-white/[0.06] rounded-xl p-8 text-center">
          <p className="text-xs text-slate-600">No tasks</p>
        </div>
      ) : (
        taskList.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isAdmin={isAdmin}
            onEditTask={onEditTask}
            onStatusChange={onStatusChange}
            onDeleteConfirm={onDeleteConfirm}
          />
        ))
      )}
    </div>
  </div>
)

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assignee: '',
    dueDate: '',
    status: 'TODO',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const isAdmin = project?.members?.find(
    (m) => m.user_id === user?.id && m.role === 'ADMIN'
  )

  const fetchProject = useCallback(async () => {
    await Promise.resolve()
    try {
      setIsLoading(prev => !prev ? true : prev)
      const [projectRes, tasksRes] = await Promise.all([
        axiosInstance.get(`/projects/${id}`),
        axiosInstance.get(`/projects/${id}/tasks`),
      ])
      setProject(projectRes.data.data)
      setTasks(tasksRes.data.data || [])
    } catch {
      toast.error('Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject()
  }, [fetchProject])

  const openCreateTask = () => {
    setEditingTask(null)
    setTaskForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      assignee: '',
      dueDate: '',
      status: 'TODO',
    })
    setIsTaskModalOpen(true)
  }

  const openEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'MEDIUM',
      assignee: task.assigned_to_id || '',
      dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      status: task.status || 'TODO',
    })
    setIsTaskModalOpen(true)
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) return
    try {
      setIsSubmitting(true)
      const payload = {
        title: taskForm.title,
        description: taskForm.description || null,
        priority: taskForm.priority,
        assigned_to_id: taskForm.assignee || null,
        due_date: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : null,
      }

      if (editingTask) {
        payload.status = taskForm.status
        await axiosInstance.put(`/tasks/${editingTask.id}`, payload)
        toast.success('Task updated successfully!')
      } else {
        await axiosInstance.post(`/projects/${id}/tasks`, payload)
        toast.success('Task created successfully!')
      }
      setIsTaskModalOpen(false)
      fetchProject()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      })
      toast.success('Status updated!')
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      )
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`)
      toast.success('Task deleted!')
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setDeleteConfirm(null)
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const members = project?.members || []
  const todoTasks = tasks.filter((t) => t.status === 'TODO')
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS')
  const doneTasks = tasks.filter((t) => t.status === 'DONE')

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
        <div className="flex gap-2 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-10 h-10 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Project Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link
              to="/projects"
              className="hover:text-primary-400 transition-colors"
            >
              Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-300">{project?.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{project?.name}</h1>
          {project?.description && (
            <p className="text-slate-400 mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button onClick={openCreateTask} className="gap-2">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          )}
          {isAdmin && (
            <Link to={`/projects/${id}/settings`}>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Members */}
      {members.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Members:</span>
          <div className="flex -space-x-2">
            {members.slice(0, 8).map((m, i) => (
              <Avatar
                key={m.user_id || i}
                className="w-8 h-8 ring-2 ring-background"
              >
                <AvatarFallback className="text-xs">
                  {getInitials(m.name || '')}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 8 && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 ring-2 ring-background">
                +{members.length - 8}
              </div>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Views */}
      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban" className="gap-2">
            <LayoutGrid className="w-4 h-4" /> Kanban
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-2">
            <Table className="w-4 h-4" /> Table
          </TabsTrigger>
        </TabsList>

        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="flex gap-6 overflow-x-auto pb-4">
            <KanbanColumn
              title="To Do"
              variant="todo"
              taskList={todoTasks}
              count={todoTasks.length}
              isAdmin={isAdmin}
              onEditTask={openEditTask}
              onStatusChange={handleStatusChange}
              onDeleteConfirm={setDeleteConfirm}
            />
            <KanbanColumn
              title="In Progress"
              variant="in_progress"
              taskList={inProgressTasks}
              count={inProgressTasks.length}
              isAdmin={isAdmin}
              onEditTask={openEditTask}
              onStatusChange={handleStatusChange}
              onDeleteConfirm={setDeleteConfirm}
            />
            <KanbanColumn
              title="Done"
              variant="done"
              taskList={doneTasks}
              count={doneTasks.length}
              isAdmin={isAdmin}
              onEditTask={openEditTask}
              onStatusChange={handleStatusChange}
              onDeleteConfirm={setDeleteConfirm}
            />
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {tasks.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-slate-400">
                    No tasks yet. Create one to get started!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Assignee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {tasks.map((task) => (
                        <tr
                          key={task.id}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openEditTask(task)}
                              className="text-sm font-medium text-white hover:text-primary-300 transition-colors text-left"
                            >
                              {task.title}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {task.assigned_to?.name ? (
                                <>
                                  <Avatar className="w-6 h-6 ring-1">
                                    <AvatarFallback className="text-[10px]">
                                      {getInitials(task.assigned_to.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-slate-300">
                                    {task.assigned_to.name}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm text-slate-500">
                                  Unassigned
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={priorityVariant[task.priority]}>
                              {task.priority}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={statusVariant[task.status]}>
                              {statusLabel[task.status] || task.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {formatDate(task.due_date)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Change Status
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {STATUSES.map((s) => (
                                  <DropdownMenuItem
                                    key={s.value}
                                    onClick={() =>
                                      handleStatusChange(task.id, s.value)
                                    }
                                  >
                                    {s.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openEditTask(task)}
                                >
                                  <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                {isAdmin && (
                                  <DropdownMenuItem
                                    className="text-red-400 focus:text-red-300"
                                    onClick={() => setDeleteConfirm(task.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />{' '}
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Create/Edit Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? 'Update the task details below.'
                : 'Fill in the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-desc">Description</Label>
              <textarea
                id="task-desc"
                placeholder="Task description..."
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                className="flex min-h-[80px] w-full rounded-lg border border-white/[0.08] bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(v) =>
                    setTaskForm({ ...taskForm, priority: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={taskForm.status}
                  onValueChange={(v) =>
                    setTaskForm({ ...taskForm, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={taskForm.assignee}
                  onValueChange={(v) =>
                    setTaskForm({ ...taskForm, assignee: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem
                        key={m.user_id}
                        value={m.user_id}
                      >
                        {m.name || 'Member'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due">Due Date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                  className="[color-scheme:dark]"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTaskModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : editingTask ? (
                  'Update Task'
                ) : (
                  'Create Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteTask(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
