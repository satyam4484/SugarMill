"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useState } from "react"
import {
  Paperclip,
  Send,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  ChevronRight,
  ImageIcon,
  File,
  FileText,
  Mic,
  Smile,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define message interface
interface Message {
  id: string
  sender: string
  senderRole: "supervisor" | "contractor" | "mill-owner" | "admin"
  avatar?: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: {
    type: "image" | "document" | "other"
    name: string
    url: string
  }[]
}

// Mock contacts
const contacts = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Contractor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Please ensure all labourers are present tomorrow for the new contract.",
    timestamp: new Date(2024, 3, 15, 9, 30),
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Mill Manager",
    role: "Mill Owner",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you provide the latest attendance report?",
    timestamp: new Date(2024, 3, 14, 16, 45),
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Admin",
    role: "System Admin",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your account has been verified.",
    timestamp: new Date(2024, 3, 10, 10, 15),
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "Team Group",
    role: "Group Chat",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Santosh Kamble: Will there be a meeting today?",
    timestamp: new Date(2024, 3, 15, 8, 0),
    unread: 5,
    online: true,
    participants: 25,
  },
]

// Mock messages
const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Rajesh Kumar",
    senderRole: "contractor",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Good morning! We have a new contract starting tomorrow with Ganesh Sugar Mills. Please ensure all labourers are present.",
    timestamp: new Date(2024, 3, 15, 9, 30),
    read: true,
  },
  {
    id: "2",
    sender: "You",
    senderRole: "supervisor",
    content: "Good morning! I'll make sure everyone is informed and ready for tomorrow.",
    timestamp: new Date(2024, 3, 15, 9, 35),
    read: true,
  },
  {
    id: "3",
    sender: "Rajesh Kumar",
    senderRole: "contractor",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Great! Also, please ensure everyone has their ID cards with them.",
    timestamp: new Date(2024, 3, 15, 9, 40),
    read: true,
  },
  {
    id: "4",
    sender: "You",
    senderRole: "supervisor",
    content: "Understood. I've already reminded them yesterday but will do so again today.",
    timestamp: new Date(2024, 3, 15, 9, 45),
    read: true,
  },
  {
    id: "5",
    sender: "Rajesh Kumar",
    senderRole: "contractor",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Here's the schedule for tomorrow. Please share it with the team.",
    timestamp: new Date(2024, 3, 15, 10, 0),
    read: true,
    attachments: [
      {
        type: "document",
        name: "Schedule_April_16.pdf",
        url: "#",
      },
    ],
  },
  {
    id: "6",
    sender: "You",
    senderRole: "supervisor",
    content: "Got it. I'll share it right away.",
    timestamp: new Date(2024, 3, 15, 10, 5),
    read: true,
  },
  {
    id: "7",
    sender: "Rajesh Kumar",
    senderRole: "contractor",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Is Santosh Kamble available tomorrow? Mill owner specifically asked for him.",
    timestamp: new Date(2024, 3, 15, 14, 20),
    read: true,
  },
  {
    id: "8",
    sender: "You",
    senderRole: "supervisor",
    content: "Yes, he is available tomorrow. I've already confirmed with him.",
    timestamp: new Date(2024, 3, 15, 14, 25),
    read: true,
  },
  {
    id: "9",
    sender: "Rajesh Kumar",
    senderRole: "contractor",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Perfect! That's all for now. Let me know if you have any questions.",
    timestamp: new Date(2024, 3, 15, 14, 30),
    read: false,
  },
]

export default function SupervisorChatPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "You",
      senderRole: "supervisor",
      content: newMessage,
      timestamp: new Date(),
      read: true,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <DashboardLayout role="supervisor">
      <div className="flex flex-col gap-5 h-[calc(100vh-9rem)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Team Communication</h1>
          <p className="text-muted-foreground">Chat with contractors, mill owners, and team members.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 overflow-hidden"
        >
          <Card className="h-full">
            <div className="grid md:grid-cols-[300px_1fr] h-full">
              {/* Contacts panel */}
              <div className="border-r h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search conversations..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="px-4 pt-2">
                      <TabsList className="w-full">
                        <TabsTrigger value="all" className="flex-1">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="flex-1">
                          Unread
                        </TabsTrigger>
                        <TabsTrigger value="groups" className="flex-1">
                          Groups
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="all" className="mt-0">
                      <div className="divide-y">
                        {filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className={`p-3 cursor-pointer hover:bg-muted transition-colors ${
                              selectedContact.id === contact.id ? "bg-muted" : ""
                            }`}
                            onClick={() => setSelectedContact(contact)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {contact.online && (
                                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium truncate">{contact.name}</h4>
                                  <span className="text-xs text-muted-foreground">{formatTime(contact.timestamp)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                                  {contact.unread > 0 && (
                                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                      {contact.unread}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="unread" className="mt-0">
                      <div className="divide-y">
                        {filteredContacts
                          .filter((contact) => contact.unread > 0)
                          .map((contact) => (
                            <div
                              key={contact.id}
                              className={`p-3 cursor-pointer hover:bg-muted transition-colors ${
                                selectedContact.id === contact.id ? "bg-muted" : ""
                              }`}
                              onClick={() => setSelectedContact(contact)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {contact.online && (
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium truncate">{contact.name}</h4>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(contact.timestamp)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                      {contact.unread}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="groups" className="mt-0">
                      <div className="divide-y">
                        {filteredContacts
                          .filter((contact) => contact.participants)
                          .map((contact) => (
                            <div
                              key={contact.id}
                              className={`p-3 cursor-pointer hover:bg-muted transition-colors ${
                                selectedContact.id === contact.id ? "bg-muted" : ""
                              }`}
                              onClick={() => setSelectedContact(contact)}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium truncate">{contact.name}</h4>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(contact.timestamp)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground truncate">
                                      {contact.participants} members
                                    </p>
                                    {contact.unread > 0 && (
                                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                        {contact.unread}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Chat panel */}
              <div className="flex flex-col h-full">
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedContact.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedContact.role}
                        {selectedContact.online ? " • Online" : " • Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                      <span className="sr-only">Call</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                      <span className="sr-only">Video call</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                        <DropdownMenuItem>Block contact</DropdownMenuItem>
                        <DropdownMenuItem>Clear chat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const isFirstMessageOfDay =
                      index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

                    return (
                      <div key={message.id} className="space-y-4">
                        {isFirstMessageOfDay && (
                          <div className="flex justify-center">
                            <span className="text-xs bg-muted px-2 py-1 rounded-md">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${message.senderRole === "supervisor" ? "justify-end" : "justify-start"}`}
                        >
                          <div className="flex gap-2 max-w-[80%]">
                            {message.senderRole !== "supervisor" && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`space-y-1 ${message.senderRole === "supervisor" ? "order-first" : ""}`}>
                              <div
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  message.senderRole === "supervisor"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                {message.content}
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {message.attachments.map((attachment, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 rounded-md bg-background/50 p-2"
                                      >
                                        <FileText className="h-4 w-4" />
                                        <span className="text-xs">{attachment.name}</span>
                                        <ChevronRight className="h-4 w-4 ml-auto" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</p>
                            </div>
                            {message.senderRole === "supervisor" && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                                <AvatarFallback>YO</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Chat input */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Smile className="h-5 w-5" />
                      <span className="sr-only">Emoji</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-5 w-5" />
                          <span className="sr-only">Attach</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          <span>Image</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <File className="mr-2 h-4 w-4" />
                          <span>Document</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mic className="mr-2 h-4 w-4" />
                          <span>Audio</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                      placeholder="Type your message..."
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-5 w-5" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
