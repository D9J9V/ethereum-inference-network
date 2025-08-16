"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Settings, Loader2 } from "lucide-react"
import { ChatSidebar } from "./chat-sidebar"
import { ModelDropdown } from "./model-dropdown"
import type { Model } from "./model-dropdown"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [activeChat, setActiveChat] = useState("1")
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      // Prepare messages for API
      const apiMessages = [...messages, newMessage].map(msg => ({
        role: msg.sender === "user" ? "user" as const : "assistant" as const,
        content: msg.content
      }))

      // Determine provider and model
      const provider = selectedModel?.provider || 'asi'
      const model = selectedModel?.modelPath || selectedModel?.id || 'llama3.1-8b'

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()
      
      // Extract content based on response format
      let assistantContent = ''
      if (data.choices && data.choices.length > 0) {
        const choice = data.choices[0]
        // Handle chat/completions format
        if (choice.message && choice.message.content) {
          assistantContent = choice.message.content
        }
        // Handle completions format
        else if (choice.text) {
          assistantContent = choice.text
        }
      }

      if (!assistantContent) {
        throw new Error('No response content received')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantContent,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      
      // Log payment info if present
      if (data.payment) {
        console.log('Payment info:', data.payment)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId)
    // Reset messages for new chat (in real app, would load chat history)
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar activeChat={activeChat} onChatSelect={handleChatSelect} />

      <div className="flex flex-col flex-1 max-w-4xl bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Ethereum Inference Network</h1>
              <ModelDropdown onModelChange={setSelectedModel} />
            </div>
          </div>
          {/* Settings Button */}
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "assistant" && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              <Card
                className={`max-w-xs sm:max-w-md p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground shadow-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>

              {message.sender === "user" && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary flex-shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-input border-border focus:ring-ring"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
