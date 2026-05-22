import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
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
import { Skeleton } from '../components/ui/Skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/Dialog'
import { FolderPlus, Users, ListTodo, ArrowRight, Folders } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProjects = async () => {
    await Promise.resolve()
    try {
      setIsLoading(prev => !prev ? true : prev)
      const res = await axiosInstance.get('/projects')
      setProjects(res.data.data || [])
    } catch {
      toast.error('Failed to load projects')
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects()
  }, [])


  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProject.name.trim()) return
    try {
      setIsSubmitting(true)
      await axiosInstance.post('/projects', newProject)
      toast.success('Project created successfully!')
      setIsCreateOpen(false)
      setNewProject({ name: '', description: '' })
      fetchProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">
            Manage and organize your team projects
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <FolderPlus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6">
            <Folders className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No projects yet
          </h3>
          <p className="text-slate-400 mb-6 text-center max-w-md">
            Create your first project to start organizing tasks and
            collaborating with your team.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <FolderPlus className="w-4 h-4" />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card
                className="group h-full hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer overflow-hidden relative"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-teal-500/20 flex items-center justify-center border border-primary-500/20">
                        <span className="text-lg font-bold text-primary-400">
                          {project.name?.charAt(0)?.toUpperCase() || 'P'}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-primary-300 transition-colors">
                          {project.name}
                        </CardTitle>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-all duration-300 group-hover:translate-x-1" />
                  </div>
                  <CardDescription className="mt-2 line-clamp-2">
                    {project.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{project.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ListTodo className="w-3.5 h-3.5" />
                      <span>
                        {project.taskCount || project.tasks?.length || 0} tasks
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to organize your team&apos;s work.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="e.g. Website Redesign"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <textarea
                id="project-description"
                placeholder="Brief description of the project..."
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description: e.target.value,
                  })
                }
                className="flex min-h-[100px] w-full rounded-lg border border-white/[0.08] bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 hover:border-white/[0.15] resize-none"
                rows={3}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  'Create Project'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
