"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, MessageSquare, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

interface ChatSidebarProps {
  activeChat: string
  onChatSelect: (chatId: string) => void
}

export function ChatSidebar({ activeChat, onChatSelect }: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [chats] = useState<Chat[]>([
    {
      id: "1",
      title: "General Discussion",
      lastMessage: "Hello! I'm your AI assistant...",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Smart Contract Analysis",
      lastMessage: "Let me analyze this contract for you...",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      title: "Gas Optimization",
      lastMessage: "Here are some optimization strategies...",
      timestamp: new Date(Date.now() - 7200000),
    },
  ])

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-80"} h-screen bg-card border-r border-border flex flex-col transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {!isCollapsed ? (
            <Button className="flex-1 justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          ) : (
            <Button className="w-8 h-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
            </Button>
          )}

          <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <Card
            key={chat.id}
            className={`p-3 mb-2 cursor-pointer transition-colors hover:bg-accent ${
              activeChat === chat.id ? "bg-accent border-primary" : "bg-card"
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            {!isCollapsed ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-foreground truncate">{chat.title}</h3>
                      <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-accent"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {chat.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
