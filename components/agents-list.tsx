'use client'

import { useState, useEffect } from 'react'
import { Bot, Trash2, RefreshCw, Zap, Brain } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { agentsApi, Agent } from '@/lib/api'

export function AgentsList({ onDelete }: { onDelete?: () => void }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    setLoading(true)
    try {
      const response = await agentsApi.getAll()
      setAgents(response.data)
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    
    setDeleting(id)
    try {
      await agentsApi.delete(id)
      await loadAgents()
      onDelete?.()
    } catch (error) {
      console.error('Error deleting agent:', error)
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

  if (agents.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Bot className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No agents yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Create your first AI agent to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="group hover:border-primary/40 transition-all hover:shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{agent.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1.5">
                    {agent.agent_type}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(agent.id)}
                disabled={deleting === agent.id}
              >
                {deleting === agent.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <CardDescription className="line-clamp-2 min-h-[2.5rem]">
              {agent.description || 'No description'}
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              {agent.capabilities.slice(0, 3).map((cap, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  {cap}
                </Badge>
              ))}
              {agent.capabilities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{agent.capabilities.length - 3} more
                </Badge>
              )}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>Created {new Date(agent.created_at).toLocaleDateString()}</span>
              <Badge variant="outline" className="text-xs">{agent.model.split('-')[1]}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
