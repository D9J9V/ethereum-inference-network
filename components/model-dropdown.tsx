"use client"

import { useState } from "react"
import type { Model } from "./model-dropdown"

export { type Model }
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface Model {
  id: string
  name: string
  author: string
  provider: 'asi' | 'openrouter'
  modelPath?: string
  isNew?: boolean
  isFree?: boolean
}

const models: Model[] = [
  { id: "llama3.1-8b", name: "Llama 3.1 8B", author: "ASI", provider: 'asi', isNew: true },
  { id: "llama3.1-70b", name: "Llama 3.1 70B", author: "ASI", provider: 'asi' },
  { id: "openai/gpt-4", name: "GPT-4", author: "OpenAI", provider: 'openrouter', modelPath: "openai/gpt-4" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", author: "Anthropic", provider: 'openrouter', modelPath: "anthropic/claude-3-opus" },
  { id: "google/gemini-pro", name: "Gemini Pro", author: "Google", provider: 'openrouter', modelPath: "google/gemini-pro" },
  { id: "meta-llama/llama-2-70b-chat", name: "Llama 2 70B Chat", author: "Meta", provider: 'openrouter', modelPath: "meta-llama/llama-2-70b-chat" },
  { id: "mistralai/mixtral-8x7b", name: "Mixtral 8x7B", author: "Mistral AI", provider: 'openrouter', modelPath: "mistralai/mixtral-8x7b" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat", author: "DeepSeek", provider: 'openrouter', modelPath: "deepseek/deepseek-chat", isFree: true },
  { id: "qwen/qwen-2-72b-instruct", name: "Qwen 2 72B", author: "Qwen", provider: 'openrouter', modelPath: "qwen/qwen-2-72b-instruct", isNew: true },
]

interface ModelDropdownProps {
  onModelChange?: (model: Model) => void
}

export function ModelDropdown({ onModelChange }: ModelDropdownProps) {
  const [selectedModel, setSelectedModel] = useState(models[0])

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model)
    onModelChange?.(model)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <div className="flex items-center gap-2">
            <div className="text-left">
              <p className="text-sm text-muted-foreground">{selectedModel.name}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => handleModelSelect(model)}
            className="flex items-center justify-between p-3 cursor-pointer"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{model.name}</span>
                {model.isFree && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">free</span>
                )}
                {model.isNew && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">new</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                <span>by {model.author}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
