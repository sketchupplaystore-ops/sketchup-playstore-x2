"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  User,
  FileText,
  Briefcase,
  Calendar,
  TrendingUp,
  Bell,
  Upload,
  Eye,
  Download,
  ImageIcon,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserPlus,
  AlertCircle,
} from "lucide-react"

const mockProjects = [
  {
    id: 1,
    title: "Modern Garden Design",
    address: "123 Oak Street, Beverly Hills, CA",
    client: "Johnson Family",
    status: "Available",
    urgent: false,
    dueDate: "2024-02-15",
    assignee: null,
    progress: 0,
    currentPhase: "Archicad",
    milestoneFiles: {
      archicad: { file: null, uploaded: false, status: "pending" },
      sketchup: { file: null, uploaded: false, status: "pending" },
      rendering: { file: null, uploaded: false, status: "pending" },
    },
    budget: 15,
    earnings: { archicad: 2, sketchup: 8, rendering: 5 },
  },
  {
    id: 2,
    title: "Corporate Plaza Landscaping",
    address: "456 Business Blvd, Downtown LA",
    client: "TechCorp Inc",
    status: "Under Review",
    urgent: false,
    dueDate: "2024-02-28",
    assignee: "Sarah Wilson",
    progress: 35,
    currentPhase: "SketchUp",
    milestoneFiles: {
      archicad: {
        file: { name: "corporate-plaza.pln", size: "8.2 MB", preview: "/archicad-file-icon.jpg" },
        uploaded: true,
        status: "completed",
      },
      sketchup: {
        file: { name: "corporate-plaza.skp", size: "12.4 MB", preview: "/sketchup-3d-model-preview.jpg" },
        uploaded: true,
        status: "under_review",
      },
      rendering: { file: null, uploaded: false, status: "pending" },
    },
    budget: 15,
    earnings: { archicad: 2, sketchup: 8, rendering: 5 },
  },
  {
    id: 3,
    title: "Residential Backyard Oasis",
    address: "789 Maple Ave, Pasadena, CA",
    client: "Smith Family",
    status: "In Revision",
    urgent: true,
    dueDate: "2024-01-25",
    assignee: "Sarah Wilson",
    progress: 85,
    currentPhase: "Final Rendering",
    milestoneFiles: {
      archicad: {
        file: { name: "backyard-oasis.pln", size: "6.1 MB", preview: "/archicad-file-icon.jpg" },
        uploaded: true,
        status: "completed",
      },
      sketchup: {
        file: { name: "backyard-oasis.skp", size: "12.4 MB", preview: "/sketchup-3d-model-preview.jpg" },
        uploaded: true,
        status: "completed",
      },
      rendering: {
        file: { name: "backyard-render-v2.jpg", size: "4.2 MB", preview: "/landscape-render.jpg" },
        uploaded: true,
        status: "revision_requested",
        version: 2,
      },
    },
    budget: 15,
    earnings: { archicad: 2, sketchup: 8, rendering: 5 },
  },
]

const recentActivity = [
  {
    id: 1,
    type: "milestone_completed",
    title: "SketchUp design for Modern Backyard Landscape has been delivered",
    time: "5 minutes ago",
    status: "Complete",
    action: "Review",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "approaching_deadline",
    title: "Lumion rendering for Commercial Plaza due in 2 days",
    time: "1 hour ago",
    status: "Urgent",
    action: "View Project",
    icon: Clock,
  },
  {
    id: 3,
    type: "new_assignment",
    title: "Sarah Chen assigned to Residential Garden project",
    time: "3 hours ago",
    status: "New",
    action: "View Details",
    icon: UserPlus,
  },
  {
    id: 4,
    type: "revision_requested",
    title: "Client requested changes to Modern Windows Backyard design",
    time: "1 day ago",
    status: "Action Required",
    action: "View Revision",
    icon: AlertTriangle,
  },
]

const currentUser = {
  name: "Sarah Wilson",
  id: 2,
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "In Progress":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Under Review":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "In Revision":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getActivityStatusColor = (status: string) => {
  switch (status) {
    case "Complete":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Urgent":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "New":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Action Required":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

interface DesignerPageProps {
  onNavigate: (page: string) => void
  onRoleSwitch: (role: "admin" | "designer" | "client") => void
  onLogout?: () => void
}

export function DesignerPage({ onNavigate, onRoleSwitch, onLogout }: DesignerPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [showMilestoneModal, setShowMilestoneModal] = useState<number | null>(null)
  const [selectedMilestones, setSelectedMilestones] = useState<{
    archicad: boolean
    sketchup: boolean
    lumion: boolean
  }>({
    archicad: false,
    sketchup: false,
    lumion: false,
  })

  const availableJobs = mockProjects.filter((p) => p.status === "Available")
  const myProjects = mockProjects.filter((p) => p.assignee === currentUser.name)
  const allRelevantProjects = [...availableJobs, ...myProjects]

  const filteredProjects = allRelevantProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handlePickJob = (projectId: number) => {
    setShowMilestoneModal(projectId)
    setSelectedMilestones({ archicad: false, sketchup: false, lumion: false })
  }

  const confirmJobSelection = () => {
    const selectedCount = Object.values(selectedMilestones).filter(Boolean).length
    if (selectedCount === 0) {
      alert("Please select at least one milestone to work on.")
      return
    }

    console.log("Designer picking job:", showMilestoneModal, "with milestones:", selectedMilestones)
    setShowMilestoneModal(null)
    // In real app, this would update the database
  }

  const handleMarkComplete = (projectId: number, milestone: string) => {
    console.log(`[v0] Marking ${milestone} as complete for project ${projectId}`)
    // In real app, this would update the project status to "Under Review"
  }

  const handleMilestoneFileUpload = (projectId: number, milestone: string, files: FileList) => {
    const maxSize = 10 * 1024 * 1024 * 1024 // 10GB in bytes
    const file = files[0]

    if (!file) return

    if (file.size > maxSize) {
      alert(`File ${file.name} exceeds 10GB limit`)
      return
    }

    // Validate file types based on milestone
    const validExtensions = {
      archicad: [".pln"],
      sketchup: [".skp"],
      rendering: [".jpg", ".jpeg", ".png", ".pdf"],
    }

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    const allowedExtensions = validExtensions[milestone as keyof typeof validExtensions]

    if (!allowedExtensions.includes(fileExtension)) {
      alert(`Invalid file type for ${milestone}. Expected: ${allowedExtensions.join(", ")}`)
      return
    }

    console.log(`[v0] Uploading ${milestone} file for project ${projectId}:`, file.name, file.size)
    // In real app, this would upload to Wasabi
  }

  const handleDragOver = (e: React.DragEvent, identifier: string) => {
    e.preventDefault()
    setDragOver(identifier)
  }

  const handleDragLeave = () => {
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent, projectId: number, milestone: string) => {
    e.preventDefault()
    setDragOver(null)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleMilestoneFileUpload(projectId, milestone, files)
    }
  }

  const monthlyEarnings = myProjects.reduce((total, project) => {
    if (project.progress >= 25) total += project.earnings.archicad
    if (project.progress >= 60) total += project.earnings.sketchup
    if (project.progress >= 90) total += project.earnings.rendering
    return total
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-md px-3 h-7 text-xs transition-colors bg-white border-slate-200"
          onClick={() => onRoleSwitch("admin")}
        >
          Admin
        </Button>
        <Button
          size="sm"
          variant="default"
          className="bg-slate-800 text-white hover:bg-slate-900 rounded-md px-4 h-8 shadow-sm"
        >
          Designer
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-md px-3 h-7 text-xs transition-colors bg-white border-slate-200"
          onClick={() => onRoleSwitch("client")}
        >
          Client
        </Button>
        {onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-xs text-slate-500 hover:text-slate-700 px-2 h-6"
          >
            Logout
          </Button>
        )}
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Designer Dashboard</h1>
                <p className="text-sm text-slate-500">Available Jobs & My Projects</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-md px-3 h-7 text-xs transition-colors"
                  onClick={() => onRoleSwitch("admin")}
                >
                  Admin
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-slate-800 text-white hover:bg-slate-900 rounded-md px-3 h-7 text-xs shadow-sm"
                >
                  Designer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-md px-3 h-7 text-xs transition-colors"
                  onClick={() => onRoleSwitch("client")}
                >
                  Client
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-700">
                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-3 w-3 text-slate-600" />
                </div>
                <span>{currentUser.name}</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1 px-6 pb-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg px-4 h-8 shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-slate-100 hover:text-slate-800 rounded-lg px-4 h-8 transition-colors"
              onClick={() => onNavigate("files")}
            >
              <FolderOpen className="h-4 w-4" />
              Files
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Available Jobs Section */}
          {availableJobs.length > 0 && (
            <Card className="border-slate-200 mb-6 bg-white">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 shadow-sm">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-800 text-lg">Available Projects</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">Select your preferred milestones and start earning</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {availableJobs.map((project) => (
                    <Card
                      key={project.id}
                      className="border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(project.status)} variant="outline">
                              {project.status}
                            </Badge>
                            <span className="text-sm font-semibold text-slate-700">${project.budget}</span>
                          </div>

                          <div>
                            <h3 className="font-semibold text-base text-slate-900 mb-1">{project.address}</h3>
                            <p className="text-sm text-slate-600">Client: {project.client}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.dueDate).toLocaleDateString()}
                            </div>
                          </div>

                          <Button
                            onClick={() => handlePickJob(project.id)}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-sm hover:shadow-md transition-all"
                            size="sm"
                          >
                            Select Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Projects Section */}
          <div className="border-slate-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-800">My Active Projects</h2>
            </div>
            <div>
              {myProjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>No active projects yet. Select a project from available projects above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myProjects.map((project) => (
                    <Card key={project.id} className="border-slate-200 hover:border-slate-300 transition-all">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Project Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(project.status)} variant="outline">
                                {project.status}
                              </Badge>
                              {project.urgent && (
                                <Badge className="bg-red-50 text-red-700 border-red-200" variant="outline">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <span className="text-lg font-semibold text-slate-700">${project.budget}</span>
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-1">{project.address}</h3>
                            <p className="text-sm text-slate-600">Client: {project.client}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Due: {new Date(project.dueDate).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Milestone File Upload Sections */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-700">Project Milestones</h4>

                            {/* Archicad Phase */}
                            <div className="border rounded-lg p-3 bg-slate-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Archicad (.pln)</span>
                                <span className="text-xs text-slate-600">$2</span>
                              </div>
                              {project.milestoneFiles.archicad.uploaded ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3 p-2 bg-white rounded border">
                                    <ImageIcon
                                      src={project.milestoneFiles.archicad.file?.preview || "/placeholder.svg"}
                                      alt="File preview"
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        {project.milestoneFiles.archicad.file?.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {project.milestoneFiles.archicad.file?.size}
                                      </p>
                                    </div>
                                    <Button size="sm" variant="outline">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {project.milestoneFiles.archicad.status === "pending" && (
                                    <Button
                                      size="sm"
                                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => handleMarkComplete(project.id, "archicad")}
                                    >
                                      Mark as Complete
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`border-2 border-dashed rounded p-3 text-center transition-colors cursor-pointer ${
                                    dragOver === `${project.id}-archicad`
                                      ? "border-slate-400 bg-slate-100"
                                      : "border-slate-300 hover:border-slate-400"
                                  }`}
                                  onDragOver={(e) => handleDragOver(e, `${project.id}-archicad`)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, project.id, "archicad")}
                                  onClick={() => document.getElementById(`archicad-${project.id}`)?.click()}
                                >
                                  <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                                  <p className="text-xs text-slate-500">Upload .pln file</p>
                                  <input
                                    type="file"
                                    accept=".pln"
                                    className="hidden"
                                    id={`archicad-${project.id}`}
                                    onChange={(e) =>
                                      e.target.files &&
                                      handleMilestoneFileUpload(project.id, "archicad", e.target.files)
                                    }
                                  />
                                </div>
                              )}
                            </div>

                            {/* SketchUp Phase */}
                            <div className="border rounded-lg p-3 bg-slate-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">SketchUp (.skp)</span>
                                <span className="text-xs text-slate-600">$8</span>
                              </div>
                              {project.milestoneFiles.sketchup.uploaded ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3 p-2 bg-white rounded border">
                                    <ImageIcon
                                      src={project.milestoneFiles.sketchup.file?.preview || "/placeholder.svg"}
                                      alt="File preview"
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        {project.milestoneFiles.sketchup.file?.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {project.milestoneFiles.sketchup.file?.size}
                                      </p>
                                    </div>
                                    <Button size="sm" variant="outline">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {project.milestoneFiles.sketchup.status === "pending" && (
                                    <Button
                                      size="sm"
                                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => handleMarkComplete(project.id, "sketchup")}
                                    >
                                      Mark as Complete
                                    </Button>
                                  )}
                                  {project.milestoneFiles.sketchup.status === "under_review" && (
                                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded text-purple-700 text-sm">
                                      <Clock className="h-4 w-4" />
                                      Under Review
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`border-2 border-dashed rounded p-3 text-center transition-colors cursor-pointer ${
                                    dragOver === `${project.id}-sketchup`
                                      ? "border-slate-400 bg-slate-100"
                                      : "border-slate-300 hover:border-slate-400"
                                  }`}
                                  onDragOver={(e) => handleDragOver(e, `${project.id}-sketchup`)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, project.id, "sketchup")}
                                  onClick={() => document.getElementById(`sketchup-${project.id}`)?.click()}
                                >
                                  <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                                  <p className="text-xs text-slate-500">Upload .skp file</p>
                                  <input
                                    type="file"
                                    accept=".skp"
                                    className="hidden"
                                    id={`sketchup-${project.id}`}
                                    onChange={(e) =>
                                      e.target.files &&
                                      handleMilestoneFileUpload(project.id, "sketchup", e.target.files)
                                    }
                                  />
                                </div>
                              )}
                            </div>

                            {/* Final Rendering Phase */}
                            <div className="border rounded-lg p-3 bg-slate-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Final Render (.jpg/.png/.pdf)</span>
                                <span className="text-xs text-slate-600">$5</span>
                              </div>
                              {project.milestoneFiles.rendering.uploaded ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3 p-2 bg-white rounded border">
                                    <ImageIcon
                                      src={project.milestoneFiles.rendering.file?.preview || "/placeholder.svg"}
                                      alt="File preview"
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        {project.milestoneFiles.rendering.file?.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {project.milestoneFiles.rendering.file?.size}
                                        {project.milestoneFiles.rendering.version &&
                                          ` • v${project.milestoneFiles.rendering.version}`}
                                      </p>
                                    </div>
                                    <Button size="sm" variant="outline">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {project.milestoneFiles.rendering.status === "revision_requested" && (
                                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded text-orange-700 text-sm">
                                      <AlertTriangle className="h-4 w-4" />
                                      Revision Requested - Upload new version
                                    </div>
                                  )}
                                  {project.milestoneFiles.rendering.status === "pending" && (
                                    <Button
                                      size="sm"
                                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => handleMarkComplete(project.id, "rendering")}
                                    >
                                      Mark as Complete
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`border-2 border-dashed rounded p-3 text-center transition-colors cursor-pointer ${
                                    dragOver === `${project.id}-rendering`
                                      ? "border-slate-400 bg-slate-100"
                                      : "border-slate-300 hover:border-slate-400"
                                  }`}
                                  onDragOver={(e) => handleDragOver(e, `${project.id}-rendering`)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, project.id, "rendering")}
                                  onClick={() => document.getElementById(`rendering-${project.id}`)?.click()}
                                >
                                  <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                                  <p className="text-xs text-slate-500">Upload image or PDF</p>
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    className="hidden"
                                    id={`rendering-${project.id}`}
                                    onChange={(e) =>
                                      e.target.files &&
                                      handleMilestoneFileUpload(project.id, "rendering", e.target.files)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 bg-transparent transition-colors"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="w-80 border-l border-slate-200 bg-white p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Recent Activity</h3>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                4 new
              </Badge>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getActivityStatusColor(activity.status)} variant="outline">
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-900 mb-1">{activity.title}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">{activity.time}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 text-slate-600 hover:text-slate-800"
                        >
                          {activity.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-slate-800 text-sm">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <Card className="border-slate-200">
                <CardContent className="p-3">
                  <div className="text-center">
                    <p className="text-xs text-slate-600">Available</p>
                    <p className="text-lg font-semibold">{availableJobs.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-3">
                  <div className="text-center">
                    <p className="text-xs text-slate-600">My Projects</p>
                    <p className="text-lg font-semibold">{myProjects.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-slate-200 mt-2">
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-xs text-slate-600">This Month</p>
                  <p className="text-lg font-semibold">${monthlyEarnings.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-semibold mb-4 text-slate-800 text-sm">Earnings Breakdown</h3>
          <div className="space-y-2">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Archicad Phase</span>
                <span className="text-sm text-slate-600">$2 per project</span>
              </div>
              <div className="text-xs text-slate-500">Site analysis & measurements</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">SketchUp Phase</span>
                <span className="text-sm text-slate-600">$8 per project</span>
              </div>
              <div className="text-xs text-slate-500">3D modeling & design</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Final Rendering</span>
                <span className="text-sm text-slate-600">$5 per project</span>
              </div>
              <div className="text-xs text-slate-500">Lumion visualization</div>
            </div>
          </div>

          <h3 className="font-semibold mb-3 mt-6 text-sm">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent text-sm h-8"
              size="sm"
              onClick={() => onNavigate("files")}
            >
              <FileText className="h-3 w-3 mr-2" />
              View All Files
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent text-sm h-8" size="sm">
              <TrendingUp className="h-3 w-3 mr-2" />
              View Earnings Report
            </Button>
          </div>
        </aside>
      </div>

      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-[90vw]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Select Milestones</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowMilestoneModal(null)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-600">Choose which phases you'd like to work on:</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                  <Checkbox
                    id="archicad"
                    checked={selectedMilestones.archicad}
                    onCheckedChange={(checked) => setSelectedMilestones((prev) => ({ ...prev, archicad: !!checked }))}
                  />
                  <div className="flex-1">
                    <label htmlFor="archicad" className="text-sm font-medium cursor-pointer">
                      Archicad Phase
                    </label>
                    <p className="text-xs text-slate-500">Site analysis & measurements</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">$2</span>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                  <Checkbox
                    id="sketchup"
                    checked={selectedMilestones.sketchup}
                    onCheckedChange={(checked) => setSelectedMilestones((prev) => ({ ...prev, sketchup: !!checked }))}
                  />
                  <div className="flex-1">
                    <label htmlFor="sketchup" className="text-sm font-medium cursor-pointer">
                      SketchUp Phase
                    </label>
                    <p className="text-xs text-slate-500">3D modeling & design</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">$8</span>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                  <Checkbox
                    id="lumion"
                    checked={selectedMilestones.lumion}
                    onCheckedChange={(checked) => setSelectedMilestones((prev) => ({ ...prev, lumion: !!checked }))}
                  />
                  <div className="flex-1">
                    <label htmlFor="lumion" className="text-sm font-medium cursor-pointer">
                      Lumion Rendering
                    </label>
                    <p className="text-xs text-slate-500">Final visualization</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">$5</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowMilestoneModal(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-slate-800 hover:bg-slate-900 text-white" onClick={confirmJobSelection}>
                  Confirm Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
