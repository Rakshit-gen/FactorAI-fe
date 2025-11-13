'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Bot, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createAgentsApi } from '@/lib/api'

const AGENT_TYPES = [
  { value: 'researcher', label: 'Researcher' },
  { value: 'coder', label: 'Coder' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'writer', label: 'Writer' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'debugger', label: 'Debugger' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'custom', label: 'Custom' },
]

export function CreateAgentDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { getToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [agentType, setAgentType] = useState('researcher')
  const [description, setDescription] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !systemPrompt.trim()) return

    setLoading(true)
    try {
    // TEST - Check if token exists
    const token = await getToken();
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    const agentsApi = createAgentsApi(getToken)
    await agentsApi.create({
      name,
      agent_type: agentType,
      description: description || `Custom ${agentType} agent`,
      system_prompt: systemPrompt,
      capabilities: [],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
      agent_metadata: {}
    })
      setOpen(false)
      setName('')
      setDescription('')
      setSystemPrompt('')
      onSuccess?.()
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="lg">
          <Bot className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Agent</DialogTitle>
          <DialogDescription>
            Define your agent's capabilities and behavior.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              placeholder="e.g., Marketing Content Creator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Agent Type</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={agentType}
              onChange={(e) => setAgentType(e.target.value)}
              disabled={loading}
            >
              {AGENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of the agent's purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="Define the agent's behavior, capabilities, and instructions..."
              className="min-h-[150px]"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !systemPrompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Agent'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}