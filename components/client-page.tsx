"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  Search,
  User,
  Calendar,
  FileText,
  Home,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
  Download,
  AlertCircle,
  UserPlus,
  Link,
  Mail,
  X,
  Phone,
  FolderDown,
  CreditCard,
  DollarSign,
} from "lucide-react"

const mockClientProjects = [
  {
    id: 1,
    title: "123 Oak Street, Beverly Hills, CA",
    status: "In Progress",
    dueDate: "2024-02-15",
    progress: 65,
    currentPhase: "3D Design",
    urgent: false,
    files: [
      { name: "site-photos.jpg", type: "image", size: "2.4 MB", phase: "Initial", url: "/site-analysis-document.jpg" },
      { name: "requirements.pdf", type: "pdf", size: "1.1 MB", phase: "Initial", url: "/document-materials.jpg" },
      { name: "3d-model-v1.skp", type: "sketchup", size: "8.2 MB", phase: "3D", url: "/3d-garden-model.jpg" },
    ],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: false, price: 35 },
    },
    totalPrice: 150,
    startDate: "2024-01-10",
    previews: [
      { url: "/landscape-render.jpg", type: "render", phase: "3D Design" },
      { url: "/3d-garden-model.jpg", type: "model", phase: "3D Design" },
    ],
    updates: [
      {
        date: "2024-01-15",
        phase: "Site Analysis",
        note: "Site analysis completed, initial measurements done",
        status: "Complete",
      },
      {
        date: "2024-01-22",
        phase: "3D Design",
        note: "3D modeling in progress, first draft ready for review",
        status: "In Progress",
      },
    ],
  },
  {
    id: 2,
    title: "789 Maple Ave, Pasadena, CA",
    status: "Under Review",
    dueDate: "2024-01-25",
    progress: 100,
    currentPhase: "Final Review",
    urgent: true,
    files: [
      { name: "final-render.jpg", type: "image", size: "12.1 MB", phase: "Final", url: "/landscape-render.jpg" },
      { name: "walkthrough.mp4", type: "video", size: "45.2 MB", phase: "Final", url: "/3d-animation-preview.jpg" },
    ],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: true, price: 35 },
    },
    totalPrice: 185,
    startDate: "2023-12-01",
    previews: [
      { url: "/landscape-render.jpg", type: "render", phase: "Final Rendering" },
      { url: "/site-analysis-document.jpg", type: "plan", phase: "2D Plans" },
    ],
    updates: [
      {
        date: "2024-01-20",
        phase: "Final Review",
        note: "All deliverables completed, awaiting client approval",
        status: "Under Review",
      },
    ],
  },
  {
    id: 3,
    title: "456 Pine Street, Santa Monica, CA",
    status: "In Progress",
    dueDate: "2024-03-01",
    progress: 30,
    currentPhase: "Site Analysis",
    urgent: false,
    files: [{ name: "site-survey.pdf", type: "pdf", size: "3.2 MB", phase: "Initial", url: "/document-materials.jpg" }],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: false, price: 35 },
    },
    totalPrice: 150,
    startDate: "2024-02-01",
    previews: [{ url: "/site-analysis-document.jpg", type: "plan", phase: "Site Analysis" }],
    updates: [
      {
        date: "2024-02-05",
        phase: "Site Analysis",
        note: "Initial site survey completed, soil analysis in progress",
        status: "In Progress",
      },
    ],
  },
  {
    id: 4,
    title: "321 Elm Drive, Beverly Hills, CA",
    status: "Completed",
    dueDate: "2024-01-15",
    progress: 100,
    currentPhase: "Delivered",
    urgent: false,
    files: [
      { name: "final-package.zip", type: "archive", size: "125 MB", phase: "Final", url: "/landscape-render.jpg" },
    ],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: true, price: 35 },
    },
    totalPrice: 185,
    startDate: "2023-11-15",
    previews: [
      { url: "/landscape-render.jpg", type: "render", phase: "Final Rendering" },
      { url: "/3d-garden-model.jpg", type: "model", phase: "3D Design" },
    ],
    updates: [
      {
        date: "2024-01-15",
        phase: "Final Delivery",
        note: "All project deliverables completed and delivered to client",
        status: "Completed",
      },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Under Review":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "In Revision":
      return "bg-orange-50 text-orange-700 border-orange-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

interface ClientPageProps {
  onNavigate: (page: string) => void
  onRoleSwitch: (role: "admin" | "designer" | "client") => void
  onLogout?: () => void
}

export function ClientPage({ onNavigate, onRoleSwitch, onLogout }: ClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [adminReply, setAdminReply] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMethod, setInviteMethod] = useState<"email" | "link">("email")
  const [selectedProjectForMessage, setSelectedProjectForMessage] = useState<number | null>(null)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [showWhatsAppIntegration, setShowWhatsAppIntegration] = useState(false)
  const [showPayPalModal, setShowPayPalModal] = useState(false)
  const [monthlyInvoiceAmount, setMonthlyInvoiceAmount] = useState(185) // Default amount

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "client",
      text: "Hi @admin, I have some questions about the design progress.",
      time: "10:30 AM",
      isAdmin: false,
      mentions: ["admin"],
      projectRef: null,
    },
    {
      id: 2,
      sender: "admin",
      text: "Hello @john! I'd be happy to help. What would you like to know?",
      time: "10:35 AM",
      isAdmin: true,
      mentions: ["john"],
      projectRef: null,
    },
    {
      id: 3,
      sender: "client",
      text: "When will the 3D rendering be ready for #123-oak-street?",
      time: "10:40 AM",
      isAdmin: false,
      mentions: [],
      projectRef: 1,
    },
    {
      id: 4,
      sender: "admin",
      text: "The 3D rendering for #123-oak-street should be completed by tomorrow. I'll send you a preview as soon as it's ready.",
      time: "10:45 AM",
      isAdmin: true,
      mentions: [],
      projectRef: 1,
      attachments: [{ type: "image", name: "preview-render.jpg", size: "2.1 MB" }],
    },
    {
      id: 5,
      sender: "client",
      text: "Great! Also, can we adjust the plant selection in the front yard? I've attached some reference photos.",
      time: "11:00 AM",
      isAdmin: false,
      mentions: [],
      projectRef: 1,
      attachments: [
        { type: "image", name: "reference-plants-1.jpg", size: "1.8 MB" },
        { type: "image", name: "reference-plants-2.jpg", size: "2.3 MB" },
      ],
    },
    {
      id: 6,
      sender: "admin",
      text: "Perfect! I'll review the reference photos and make those adjustments. I'll show you the updated options by end of day.",
      time: "11:05 AM",
      isAdmin: true,
      mentions: [],
      projectRef: 1,
    },
  ])

  const filteredProjects = mockClientProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleSendMessage = () => {
    if (message.trim()) {
      const mentions = message.match(/@(\w+)/g)?.map((m) => m.substring(1)) || []
      const projectRefs = message.match(/#[\w-]+/g)

      const newMessage = {
        id: messages.length + 1,
        sender: "client",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAdmin: false,
        mentions,
        projectRef: selectedProjectForMessage,
        attachments: [],
      }
      setMessages([...messages, newMessage])
      setMessage("")
      setSelectedProjectForMessage(null)
    }
  }

  const handleAdminReply = () => {
    if (adminReply.trim()) {
      const mentions = adminReply.match(/@(\w+)/g)?.map((m) => m.substring(1)) || []

      const newMessage = {
        id: messages.length + 1,
        sender: "admin",
        text: adminReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAdmin: true,
        mentions,
        projectRef: selectedProjectForMessage,
        attachments: [],
      }
      setMessages([...messages, newMessage])
      setAdminReply("")
      setSelectedProjectForMessage(null)
    }
  }

  const handleFileAttachment = (type: "image" | "pdf" | "link") => {
    // Simulate file attachment
    console.log(`Attaching ${type} file`)
    setShowAttachmentMenu(false)
  }

  const handleProjectReference = (projectId: number) => {
    setSelectedProject(projectId)
    // Scroll to project
    const projectElement = document.getElementById(`project-${projectId}`)
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: "smooth" })
    }
    // Open project chats and files
    setSelectedProjectForMessage(projectId)
  }

  const handleDownloadFile = (file: any) => {
    // Simulate file download
    const link = document.createElement("a")
    link.href = file.url || "/placeholder.svg"
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadAllFiles = (projectFiles: any[]) => {
    // Simulate zip download
    console.log("Downloading all files as zip:", projectFiles)
    // In real implementation, this would create a zip file
  }

  const handleWhatsAppIntegration = () => {
    const phoneNumber = "+1234567890" // Admin's WhatsApp number
    const projectTitle = filteredProjects[0]?.title || "Project"
    const whatsappMessage = `Hi! I have a question about my landscape design project: ${projectTitle}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleRemoveClient = (clientName: string) => {
    console.log(`Removing client: ${clientName}`)
  }

  const handleInviteClient = () => {
    console.log(`Inviting client via ${inviteMethod}: ${inviteEmail}`)
  }

  const handlePayPalPayment = () => {
    // Simulate PayPal payment
    console.log(`Processing PayPal payment of $${monthlyInvoiceAmount}`)
    // In real implementation, this would integrate with PayPal API
    setShowPayPalModal(false)
  }

  const handleSendInvoice = () => {
    // Simulate sending PayPal invoice
    console.log(`Sending PayPal invoice for $${monthlyInvoiceAmount} to client`)
    // In real implementation, this would send invoice via PayPal
  }

  const renderMessageText = (text: string, mentions: string[] = [], projectRef: number | null = null) => {
    let formattedText = text

    // Highlight mentions
    mentions.forEach((mention) => {
      formattedText = formattedText.replace(
        new RegExp(`@${mention}`, "g"),
        `<span class="bg-blue-100 text-blue-800 px-1 rounded text-xs font-medium cursor-pointer">@${mention}</span>`,
      )
    })

    if (projectRef) {
      const project = mockClientProjects.find((p) => p.id === projectRef)
      if (project) {
        const projectHash = `#${project.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .substring(0, 20)}`
        formattedText = formattedText.replace(
          new RegExp(projectHash, "g"),
          `<span class="bg-green-100 text-green-800 px-1 rounded text-xs font-medium cursor-pointer hover:bg-green-200" onclick="handleProjectReference(${projectRef})">${projectHash}</span>`,
        )
      }
    }

    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Client Dashboard</h1>
                <p className="text-sm text-slate-500">Track your landscape design progress</p>
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
                  className="text-slate-600 hover:bg-white hover:text-slate-900 rounded-md px-3 h-8 transition-colors"
                  onClick={() => onRoleSwitch("admin")}
                >
                  Admin
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:bg-white hover:text-slate-900 rounded-md px-3 h-8 transition-colors"
                  onClick={() => onRoleSwitch("designer")}
                >
                  Designer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-3 h-8 shadow-sm"
                >
                  Client
                </Button>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <span>Everlasting</span>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-slate-500 hover:text-slate-900 px-3 h-7"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-1 px-6 pb-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 h-9 shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              My Projects
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <main className="flex-1 p-6">
          <div className="space-y-4">
            <div className="space-y-3 max-w-3xl">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  id={`project-${project.id}`}
                  className="border-slate-200 hover:border-slate-300 transition-colors bg-white"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-slate-900">{project.title}</h3>
                          {project.urgent && (
                            <Badge className="bg-red-50 text-red-700 border-red-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>

                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">${project.totalPrice}</span>
                          </div>
                        </div>

                        {project.previews && project.previews.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Project Previews</h4>
                            <div className="flex gap-2">
                              {project.previews.map((preview, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={preview.url || "/placeholder.svg"}
                                    alt={`Preview ${index + 1}`}
                                    className="w-20 h-16 object-cover rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleDownloadFile({ name: `preview-${index + 1}.jpg`, url: preview.url })
                                    }
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                    <Download className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadAllFiles(project.files)}
                          className="border-slate-200 hover:border-slate-300 bg-transparent h-8 px-3"
                        >
                          <FolderDown className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                          className="border-slate-200 hover:border-slate-300 h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress</span>
                        <span className="text-sm text-slate-500">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-500">
                        <FileText className="h-4 w-4" />
                        {project.files.length} files
                      </div>
                    </div>

                    {selectedProject === project.id && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <h4 className="font-medium mb-2 text-slate-900">Recent Updates</h4>
                        <div className="space-y-2">
                          {project.updates.map((update, index) => (
                            <div key={index} className="bg-slate-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                <span className="font-medium">{update.phase}</span>
                                <span>•</span>
                                <span>{new Date(update.date).toLocaleDateString()}</span>
                                <Badge className={getStatusColor(update.status)} variant="outline">
                                  {update.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-700">{update.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <aside className="w-96 border-l border-slate-200 bg-white p-6 space-y-6">
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Project Messages</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWhatsAppIntegration(!showWhatsAppIntegration)}
                    className="border-slate-200 hover:border-green-300 hover:bg-green-50 h-8 px-3"
                  >
                    <Phone className="h-4 w-4 mr-1 text-green-600" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                    className="border-slate-200 hover:border-slate-300 h-8 px-3"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite
                  </Button>
                </div>
              </div>

              {/* Messages Display Area */}
              <div className="h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 mb-4 bg-slate-50">
                <div className="space-y-3">
                  {messages.slice(-6).map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] p-2 rounded-lg ${
                          msg.isAdmin ? "bg-white border border-slate-200 text-slate-900" : "bg-slate-900 text-white"
                        }`}
                      >
                        <div className="text-sm">{renderMessageText(msg.text, msg.mentions, msg.projectRef)}</div>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.attachments.map((attachment, idx) => (
                              <div key={idx} className="text-xs opacity-75 flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {attachment.name} ({attachment.size})
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-xs opacity-75 mt-1">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input Area */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message... Use @admin to mention, #project-name to reference"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border-slate-200 focus:border-slate-400"
                  />
                  <Button
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    variant="outline"
                    size="sm"
                    className="border-slate-200 hover:border-slate-300 h-10 w-10 p-0"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>

                {showAttachmentMenu && (
                  <div className="flex gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileAttachment("image")}
                      className="flex-1 h-8"
                    >
                      📷 Image
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileAttachment("pdf")}
                      className="flex-1 h-8"
                    >
                      📄 PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileAttachment("link")}
                      className="flex-1 h-8"
                    >
                      🔗 Link
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 h-10"
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Admin Quick Reply</span>
                </div>
                <Badge variant="outline" className="h-6">
                  2 new
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">Milestone Completed</p>
                    <p className="text-sm text-slate-600">Design phase delivered</p>
                    <p className="text-sm text-slate-500">5 min ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">Review Required</p>
                    <p className="text-sm text-slate-600">Final rendering needs approval</p>
                    <p className="text-sm text-slate-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-slate-900">Project Overview</h3>
              <div className="space-y-2">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Monthly Invoice</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Invoice amount: ${monthlyInvoiceAmount}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowPayPalModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 h-8 flex-1"
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Pay Invoice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendInvoice}
                      className="border-blue-200 hover:border-blue-300 h-8 flex-1 bg-transparent"
                    >
                      Request Invoice
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-slate-100">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Projects</p>
                    <p className="text-lg font-semibold text-slate-900">{filteredProjects.length}</p>
                  </div>
                  <Home className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-slate-100">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">In Progress</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {filteredProjects.filter((p) => p.status === "In Progress").length}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-slate-100">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Earnings</p>
                    <p className="text-lg font-semibold text-slate-900">
                      ${filteredProjects.reduce((sum, p) => sum + p.totalPrice, 0)}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {showPayPalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">PayPal Invoice Payment</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPayPalModal(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Invoice Payment</span>
                    <span className="text-lg font-bold text-blue-900">${monthlyInvoiceAmount}</span>
                  </div>
                  <p className="text-sm text-blue-700">One-time payment for current project work</p>
                </div>

                <Button
                  onClick={handlePayPalPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay with PayPal
                </Button>

                <p className="text-sm text-slate-500 text-center">
                  Secure payment processing via PayPal. Your payment information is protected.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Invite Client</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowInviteModal(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={inviteMethod === "email" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInviteMethod("email")}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant={inviteMethod === "link" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInviteMethod("link")}
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                </div>

                {inviteMethod === "email" && (
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="border-slate-200 focus:border-slate-400"
                  />
                )}

                <Button
                  onClick={handleInviteClient}
                  disabled={inviteMethod === "email" && !inviteEmail.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800"
                >
                  {inviteMethod === "email" ? "Send Invitation" : "Copy Invite Link"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
