import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Badge } from '../components/ui/Badge'
import { Separator } from '../components/ui/Separator'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/Select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/Dialog'
import { Avatar, AvatarFallback } from '../components/ui/Avatar'
import {
  ChevronRight,
  Trash2,
  UserPlus,
  Shield,
  UserMinus,
  AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectSettingsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projectForm, setProjectForm] = useState({ name: '', description: '' })
  const [isUpdating, setIsUpdating] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('MEMBER')
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchProject = useCallback(async () => {
    await Promise.resolve()
    try {
      setIsLoading(prev => !prev ? true : prev)
      const res = await axiosInstance.get(`/projects/${id}`)
      const p = res.data.data
      setProject(p)
      setProjectForm({ name: p.name || '', description: p.description || '' })
    } catch {
      toast.error('Failed to load project settings')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject()
  }, [fetchProject])


  const handleUpdateProject = async (e) => {
    e.preventDefault()
    try {
      setIsUpdating(true)
      await axiosInstance.put(`/projects/${id}`, projectForm)
      toast.success('Project updated!')
      fetchProject()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update project'
      )
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!memberEmail.trim()) return
    try {
      setIsAddingMember(true)
      await axiosInstance.post(`/projects/${id}/members`, {
        email: memberEmail,
        role: memberRole,
      })
      toast.success('Member added!')
      setMemberEmail('')
      setMemberRole('MEMBER')
      fetchProject()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to add member'
      )
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    try {
      await axiosInstance.delete(`/projects/${id}/members/${memberId}`)
      toast.success('Member removed!')
      fetchProject()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to remove member'
      )
    }
  }

  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true)
      await axiosInstance.delete(`/projects/${id}`)
      toast.success('Project deleted!')
      navigate('/projects')
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete project'
      )
    } finally {
      setIsDeleting(false)
    }
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

  const members = project?.members || []

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
        <Card className="p-6">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
            <div className="h-10 w-full bg-slate-800 rounded animate-pulse" />
            <div className="h-24 w-full bg-slate-800 rounded animate-pulse" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          to="/projects"
          className="hover:text-primary-400 transition-colors"
        >
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/projects/${id}`}
          className="hover:text-primary-400 transition-colors"
        >
          {project?.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-300">Settings</span>
      </div>

      <h1 className="text-3xl font-bold text-white">Project Settings</h1>

      {/* Update Project */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update your project information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Project Name</Label>
              <Input
                id="settings-name"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-desc">Description</Label>
              <textarea
                id="settings-desc"
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value,
                  })
                }
                className="flex min-h-[100px] w-full rounded-lg border border-white/[0.08] bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" /> Members
          </CardTitle>
          <CardDescription>
            Manage who has access to this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add member form */}
          <form
            onSubmit={handleAddMember}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder="member@email.com"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
              />
            </div>
            <Select value={memberRole} onValueChange={setMemberRole}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isAddingMember} className="gap-2">
              <UserPlus className="w-4 h-4" />
              {isAddingMember ? 'Adding...' : 'Add'}
            </Button>
          </form>

          <Separator />

          {/* Member list */}
          <div className="space-y-3">
            {members.map((m, i) => (
              <div
                key={m.user_id || i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="text-xs">
                      {getInitials(m.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {m.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {m.email || ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.role === 'ADMIN' ? 'admin' : 'member'}>
                    {m.role}
                  </Badge>
                  {m.user_id !== user?.id && (
                    <button
                      onClick={() =>
                        handleRemoveMember(m.user_id)
                      }
                      className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <div>
              <p className="text-sm font-medium text-white">
                Delete this project
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Once deleted, it cannot be recovered
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{project?.name}&quot;? All
              tasks and data will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
