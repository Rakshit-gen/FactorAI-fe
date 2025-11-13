'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { History, RefreshCw, CheckCircle2, AlertCircle, Clock, Loader2, Trash2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormattedOutput } from '@/components/formatted-output'
import { createExecutionsApi, Execution } from '@/lib/api'

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending' },
  running: { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Running' },
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

export function ExecutionsList({ onDelete }: { onDelete?: () => void }) {
  const { getToken } = useAuth()
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadExecutions = async () => {
    try {
      const executionsApi = createExecutionsApi(getToken)
      const response = await executionsApi.getAll()
      setExecutions(response.data)
    } catch (error) {
      console.error('Error loading executions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExecutions()
    const interval = setInterval(loadExecutions, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this execution?')) return
    
    setDeleting(id)
    try {
      const executionsApi = createExecutionsApi(getToken)
      await executionsApi.delete(id)
      await loadExecutions()
      onDelete?.()
    } catch (error) {
      console.error('Error deleting execution:', error)
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

  if (executions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-muted rounded-full mb-4">
            <History className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No executions yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Execute an agent to see results here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {executions.map((execution) => {
        const config = STATUS_CONFIG[execution.status]
        const Icon = config.icon

        return (
          <Card key={execution.id} className={`hover:border-primary/40 transition-all hover:shadow-lg group relative overflow-hidden border-l-4 ${config.border}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <div className={`p-2 ${config.bg} rounded-lg`}>
                      <Icon className={`h-4 w-4 ${config.color} ${execution.status === 'running' ? 'animate-spin' : ''}`} />
                    </div>
                    <Badge variant={execution.status === 'completed' ? 'default' : 'secondary'}>
                      {config.label}
                    </Badge>
                    {execution.execution_time && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {execution.execution_time}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-mono text-muted-foreground">
                    Execution {execution.id.slice(0, 8)}...
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
                  onClick={() => handleDelete(execution.id)}
                  disabled={deleting === execution.id}
                >
                  {deleting === execution.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium">Input</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {execution.input_data}
                  </p>
                </div>
              </div>

              {execution.status === 'completed' && execution.output && (
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              {execution.status === 'completed' && execution.output && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Output</p>
                    <FormattedOutput 
                      content={execution.output} 
                      title="Execution Output"
                    />
                  </div>
                  <div className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
                    <p className="text-sm line-clamp-4">
                      {formatPreviewText(execution.output)}
                    </p>
                  </div>
                </div>
              )}

              {execution.error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{execution.error}</p>
                </div>
              )}

              <div className="pt-3 border-t text-xs text-muted-foreground">
                Started {new Date(execution.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}