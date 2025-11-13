'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, Clock, Loader2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormattedOutput } from '@/components/formatted-output'
import { createTasksApi, Task } from '@/lib/api'

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending' },
  processing: { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Processing' },
  completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Completed' },
  failed: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Failed' },
}

const formatPreviewText = (text: string) => {
  if (!text) return text
  
  let formatted = text
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '$1')
  formatted = formatted.replace(/\*(.+?)\*/g, '$1')
  formatted = formatted.replace(/`(.+?)`/g, '$1')
  formatted = formatted.replace(/^#{1,6}\s+/gm, '')
  
  return formatted
}

export function TasksList({ onDelete }: { onDelete?: () => void }) {
  const { getToken } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadTasks = async () => {
    try {
      const tasksApi = createTasksApi(getToken)
      const response = await tasksApi.getAll()
      setTasks(response.data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
    const interval = setInterval(loadTasks, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    setDeleting(id)
    try {
      const tasksApi = createTasksApi(getToken)
      await tasksApi.delete(id)
      await loadTasks()
      onDelete?.()
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Sparkles className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No tasks yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Create a task to generate an AI agent</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const config = STATUS_CONFIG[task.status]
        const Icon = config.icon

        return (
          <Card key={task.id} className={`hover:border-primary/40 transition-all hover:shadow-lg group relative overflow-hidden border-l-4 ${config.border}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 ${config.bg} rounded-lg`}>
                      <Icon className={`h-4 w-4 ${config.color} ${task.status === 'processing' ? 'animate-spin' : ''}`} />
                    </div>
                    <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                      {config.label}
                    </Badge>
                    {task.created_agent_id && (
                      <Badge variant="outline" className="text-xs">
                        Agent Created
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base leading-relaxed">{task.description}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleting === task.id}
                >
                  {deleting === task.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {task.status === 'completed' && task.result?.output && (
                <div className={`p-4 rounded-lg ${config.bg} border ${config.border}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium">Agent Output</p>
                    <FormattedOutput 
                      content={task.result.output} 
                      title="Task Output"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {formatPreviewText(task.result.output)}
                  </p>
                  {task.result.agent_name && (
                    <div className="mt-3 pt-3 border-t flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        By <span className="font-medium text-foreground">{task.result.agent_name}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
              {task.error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{task.error}</p>
                </div>
              )}
              <div className="mt-4 text-xs text-muted-foreground">
                Created {new Date(task.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}