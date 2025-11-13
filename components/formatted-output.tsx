'use client'

import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface FormattedOutputProps {
  content: string
  title?: string
  triggerText?: string
}

export function FormattedOutput({ content, title = "Full Output", triggerText = "View Full" }: FormattedOutputProps) {
  const formatContent = (text: string) => {
    const lines = text.split('\n')
    
    return lines.map((line, idx) => {
      let formattedLine = line
      
      // Handle bold text (**text** or *text*)
      formattedLine = formattedLine.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      formattedLine = formattedLine.replace(/\*(.+?)\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      
      // Handle inline code (`code`)
      formattedLine = formattedLine.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">$1</code>')
      
      // Handle headers (# Header)
      if (line.startsWith('# ')) {
        return `<h1 class="text-2xl font-bold mt-6 mb-3">${formattedLine.slice(2)}</h1>`
      } 
      
      if (line.startsWith('## ')) {
        return `<h2 class="text-xl font-bold mt-5 mb-2">${formattedLine.slice(3)}</h2>`
      } 
      
      if (line.startsWith('### ')) {
        return `<h3 class="text-lg font-semibold mt-4 mb-2">${formattedLine.slice(4)}</h3>`
      }
      
      // Handle bullet points (- or *)
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return `<li class="ml-6 mb-1">${formattedLine.trim().slice(2)}</li>`
      }
      
      // Handle numbered lists (1. )
      if (/^\d+\.\s/.test(line.trim())) {
        return `<li class="ml-6 mb-1">${formattedLine.trim().replace(/^\d+\.\s/, '')}</li>`
      }
      
      // Handle code blocks (```code```)
      if (line.trim().startsWith('```')) {
        return ''
      }
      
      // Regular paragraph
      if (formattedLine.trim() && !formattedLine.includes('<h') && !formattedLine.includes('<li')) {
        return `<p class="mb-2">${formattedLine}</p>`
      }
      
      return formattedLine
    }).join('\n')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 text-xs">
          <Eye className="h-3 w-3 mr-1" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </DialogContent>
    </Dialog>
  )
}