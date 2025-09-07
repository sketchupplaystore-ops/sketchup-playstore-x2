"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  FileText,
  ImageIcon,
  File,
  Download,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Trash2,
  Eye,
  FolderOpen,
} from "lucide-react"

interface FileManagerProps {
  onBack: () => void
}

const mockFiles = [
  {
    id: 1,
    name: "Residential_Garden_v2.1.skp",
    type: "sketchup",
    size: "15.2 MB",
    project: "123 Oak Street, Beverly Hills, CA",
    uploader: "Sarah Wilson",
    uploadDate: "2024-01-12",
    lastModified: "2024-01-12 14:30",
    status: "current",
    thumbnail: "/3d-garden-model.jpg",
  },
  {
    id: 2,
    name: "Site_Analysis_Report.pdf",
    type: "pdf",
    size: "3.4 MB",
    project: "456 Business Blvd, Downtown LA",
    uploader: "Mike Johnson",
    uploadDate: "2024-01-10",
    lastModified: "2024-01-10 16:45",
    status: "approved",
    thumbnail: "/site-analysis-document.jpg",
  },
  {
    id: 3,
    name: "Plant_Schedule.xlsx",
    type: "excel",
    size: "1.2 MB",
    project: "789 Maple Ave, Pasadena, CA",
    uploader: "Emma Davis",
    uploadDate: "2024-01-08",
    lastModified: "2024-01-08 11:20",
    status: "draft",
    thumbnail: "/spreadsheet-plants.jpg",
  },
  {
    id: 4,
    name: "Final_Renders_v3.jpg",
    type: "image",
    size: "2.8 MB",
    project: "321 Pine Street, Santa Monica, CA",
    uploader: "Alex Chen",
    uploadDate: "2024-01-05",
    lastModified: "2024-01-05 09:15",
    status: "delivered",
    thumbnail: "/landscape-render.jpg",
  },
  {
    id: 5,
    name: "Lumion_Animation_Final.mp4",
    type: "video",
    size: "45.6 MB",
    project: "654 Cedar Ave, Beverly Hills, CA",
    uploader: "Lisa Brown",
    uploadDate: "2024-01-03",
    lastModified: "2024-01-03 13:22",
    status: "delivered",
    thumbnail: "/3d-animation-preview.jpg",
  },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case "sketchup":
      return <File className="h-8 w-8 text-blue-600" />
    case "pdf":
      return <FileText className="h-8 w-8 text-red-600" />
    case "excel":
      return <FileText className="h-8 w-8 text-green-600" />
    case "image":
      return <ImageIcon className="h-8 w-8 text-purple-600" />
    case "video":
      return <File className="h-8 w-8 text-orange-600" />
    case "document":
      return <FileText className="h-8 w-8 text-blue-600" />
    default:
      return <File className="h-8 w-8 text-gray-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "current":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "approved":
      return "bg-green-50 text-green-700 border-green-200"
    case "draft":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "delivered":
      return "bg-gray-100 text-gray-700 border-gray-200"
    default:
      return "bg-gray-50 text-gray-600 border-gray-200"
  }
}

export function FileManager({ onBack }: FileManagerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [dragActive, setDragActive] = useState(false)

  const filteredFiles = mockFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploader.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("Files dropped:", e.dataTransfer.files)
    }
  }, [])

  const copyFileLink = (fileId: number) => {
    navigator.clipboard.writeText(`https://app.sketchup-playstore.com/files/${fileId}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900">Files</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800 text-white">
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search files, projects, or uploaders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{filteredFiles.length} files</span>
            <span>•</span>
            <span>{mockFiles.reduce((acc, file) => acc + Number.parseFloat(file.size), 0).toFixed(1)} MB total</span>
            <span>•</span>
            <span>10GB limit per project</span>
          </div>
        </div>

        <Card
          className={`mb-6 border-2 border-dashed transition-colors ${
            dragActive ? "border-slate-400 bg-slate-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Drop files here to upload</h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your .pln, .skp, .jpg, .png, .pdf files (up to 10GB per project)
            </p>
            <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white">
              <Upload className="h-4 w-4" />
              Choose Files
            </Button>
          </CardContent>
        </Card>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-4">
                  <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={file.thumbnail || "/placeholder.svg"}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm text-gray-900 truncate pr-2">{file.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => copyFileLink(file.id)}>
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Open in Wasabi
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{file.size}</span>
                      <Badge className={getStatusColor(file.status)} size="sm">
                        {file.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p className="truncate font-medium text-gray-700">{file.project}</p>
                      <p>by {file.uploader}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{file.project}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <Badge className={getStatusColor(file.status)} size="sm">
                        {file.status}
                      </Badge>
                      <span className="w-16 text-right">{file.size}</span>
                      <div className="flex items-center gap-2 w-32">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                            {file.uploader
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{file.uploader}</span>
                      </div>
                      <span className="w-24 text-right">{file.uploadDate}</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => copyFileLink(file.id)}>
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Open in Wasabi
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
