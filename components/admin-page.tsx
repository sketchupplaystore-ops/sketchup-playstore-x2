"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Calendar,
  Eye,
  Search,
  User,
  FileText,
  UserCheck,
  Upload,
  X,
  Building2,
  MessageSquare,
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
} from "lucide-react"

const mockProjects = [
  {
    id: 1,
    title: "123 Oak Street, Beverly Hills, CA",
    address: "123 Oak Street, Beverly Hills, CA",
    client: "Johnson Family",
    status: "Available",
    dueDate: "2024-02-15",
    assignee: null,
    progress: 0,
    currentPhase: "Archicad",
    files: [
      { name: "site-photos.jpg", type: "image", size: "2.4 MB" },
      { name: "requirements.pdf", type: "pdf", size: "1.1 MB" },
    ],
    budget: 15000,
    earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
    createdBy: "Admin",
    createdAt: "2024-01-10",
    thumbnail: "/3d-garden-model.jpg",
  },
  {
    id: 2,
    title: "456 Business Blvd, Downtown LA",
    address: "456 Business Blvd, Downtown LA",
    client: "TechCorp Inc",
    status: "In Progress",
    dueDate: "2024-02-28",
    assignee: "Sarah Wilson",
    progress: 35,
    currentPhase: "SketchUp",
    files: [
      { name: "site-survey.pdf", type: "pdf", size: "3.2 MB" },
      { name: "initial-concepts.jpg", type: "image", size: "4.1 MB" },
      { name: "archicad-model.dwg", type: "file", size: "12.5 MB" },
    ],
    budget: 45000,
    earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
    createdBy: "Admin",
    createdAt: "2024-01-05",
    thumbnail: "/landscape-render.jpg",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "In Progress":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "Final Rendering":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

interface AdminPageProps {
  onNavigate: (page: string) => void
  onRoleSwitch: (role: "admin" | "designer" | "client") => void
  onLogout?: () => void
}

export function AdminPage({ onNavigate, onRoleSwitch, onLogout }: AdminPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    address: "",
    client: "",
    dueDate: "",
    budget: "",
    urgent: false,
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleCreateProject = () => {
    console.log("Creating project:", newProject, "Files:", uploadedFiles)
    setShowNewProjectForm(false)
    setNewProject({ title: "", address: "", client: "", dueDate: "", budget: "", urgent: false })
    setUploadedFiles([])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024 * 1024) // 10GB limit
    setUploadedFiles([...uploadedFiles, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Project Management & Oversight</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 h-9 border-gray-200 focus:border-slate-400 focus:ring-slate-400/20 rounded-lg bg-white"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-3 h-7 text-xs"
                >
                  Admin
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-white hover:text-slate-900 rounded-md px-3 h-7 text-xs transition-colors"
                  onClick={() => onRoleSwitch("designer")}
                >
                  Designer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-white hover:text-slate-900 rounded-md px-3 h-7 text-xs transition-colors"
                  onClick={() => onRoleSwitch("client")}
                >
                  Client
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium">John Admin</span>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-xs text-gray-500 hover:text-slate-900 px-2 h-6"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>

            <nav className="flex items-center gap-1 px-6 pb-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 h-8"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-gray-100 hover:text-slate-900 rounded-lg px-4 h-8 transition-colors text-gray-600"
                onClick={() => onNavigate("files")}
              >
                <FolderOpen className="h-4 w-4" />
                Files
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {showNewProjectForm && (
          <Card className="border-gray-200 rounded-xl mb-6 overflow-hidden bg-white">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">Post New Project</CardTitle>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Project Address</label>
                  <Input
                    value={newProject.address}
                    onChange={(e) => setNewProject({ ...newProject, address: e.target.value, title: e.target.value })}
                    placeholder="123 Oak Street, Beverly Hills, CA"
                    className="h-10 rounded-lg border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Client Name</label>
                  <Input
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    placeholder="Johnson Family"
                    className="h-10 rounded-lg border-gray-200 bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                    className="h-10 rounded-lg border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Budget ($)</label>
                  <Input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    placeholder="15000"
                    className="h-10 rounded-lg border-gray-200 bg-white"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      checked={newProject.urgent}
                      onChange={(e) => setNewProject({ ...newProject, urgent: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Urgent</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Upload Files (JPG, PDF, Videos - up to 10GB each)
                </label>
                <div>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.pdf,.mp4,.mov,.avi"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors bg-gray-50/50"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Drag & drop files or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PDF, MP4 up to 10GB each</p>
                    </div>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">{file.name}</span>
                            <p className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 rounded"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCreateProject}
                  className="bg-slate-900 hover:bg-slate-800 h-10 px-6 rounded-lg text-white"
                >
                  Post Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewProjectForm(false)}
                  className="h-10 px-6 rounded-lg border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
                <p className="text-gray-600 text-sm">Manage and oversee landscape design projects</p>
              </div>
              <Button
                onClick={() => setShowNewProjectForm(true)}
                className="gap-2 bg-slate-900 hover:bg-slate-800 h-10 px-4 rounded-lg text-white"
              >
                <Plus className="h-4 w-4" />
                Post Project
              </Button>
            </div>

            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="border-gray-200 hover:border-gray-300 transition-colors rounded-xl overflow-hidden bg-white"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{project.title}</h3>
                          <Badge
                            className={getStatusColor(project.status) + " px-2 py-1 rounded-md text-xs font-medium"}
                          >
                            {project.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {project.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                          {project.assignee && (
                            <span className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              {project.assignee}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="font-medium text-gray-700">Phase: {project.currentPhase}</span>
                          <div className="flex-1 max-w-32">
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          <span className="text-gray-500">{project.progress}%</span>
                          <span className="font-medium text-gray-900">Budget: $15k</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 rounded-lg border-gray-200 h-8 px-3 text-xs bg-white hover:bg-gray-50 text-gray-700"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 rounded-lg border-gray-200 h-8 px-3 text-xs bg-white hover:bg-gray-50 text-gray-700"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Messages
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="w-80">
            <div className="sticky top-20 space-y-4">
              <Card className="border-gray-200 rounded-xl bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Recent Activity
                    </h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">4 new</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Project Completed</p>
                        <p className="text-xs text-gray-500 mb-1">Modern Backyard Landscape delivered</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">5 minutes ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Approaching Deadline</p>
                        <p className="text-xs text-gray-500 mb-1">Commercial Plaza due in 2 days</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">1 hour ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
                          >
                            View Project
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">New Assignment</p>
                        <p className="text-xs text-gray-500 mb-1">Sarah Chen assigned to Residential Garden</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">3 hours ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Revision Requested</p>
                        <p className="text-xs text-gray-500 mb-1">Client requested changes to Modern Windows design</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">1 day ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
                          >
                            View Revision
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 rounded-xl bg-white">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3 text-sm">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Total Projects</span>
                      <span className="font-medium text-gray-900">{mockProjects.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Available Jobs</span>
                      <span className="font-medium text-gray-900">
                        {mockProjects.filter((p) => p.status === "Available").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Active Workers</span>
                      <span className="font-medium text-gray-900">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">This Month Revenue</span>
                      <span className="font-medium text-gray-900">$45k</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
