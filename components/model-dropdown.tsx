"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface Model {
  id: string
  name: string
  author: string
  isNew?: boolean
  isFree?: boolean
}

const models: Model[] = [
  { id: "asi-1", name: "ASI-1", author: "Artificial Superintelligence Alliance", isNew: true },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", author: "Anthropic" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", author: "Google" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", author: "Google" },
  {
    id: "deepseek-v3-free",
    name: "DeepSeek V3 0324 (free)",
    author: "DeepSeek",
    isFree: true,
  },
  { id: "deepseek-v3", name: "DeepSeek V3 0324", author: "DeepSeek" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", author: "Google" },
  { id: "claude-3.7-sonnet", name: "Claude 3.7 Sonnet", author: "Anthropic" },
  { id: "qwen3-coder", name: "Qwen3 Coder", author: "Qwen", isNew: true },
  { id: "r1-0528-free", name: "R1 0528 (free)", author: "DeepSeek", isFree: true },
  {
    id: "qwen3-coder-free",
    name: "Qwen3 Coder (free)",
    author: "Qwen",
    isNew: true,
    isFree: true,
  },
]

export function ModelDropdown() {
  const [selectedModel, setSelectedModel] = useState(models[0])

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
            onClick={() => setSelectedModel(model)}
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
