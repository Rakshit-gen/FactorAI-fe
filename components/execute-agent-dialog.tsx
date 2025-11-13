'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Play, Loader2 } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { createAgentsApi, createExecutionsApi, Agent } from '@/lib/api'

export function ExecuteAgentDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { getToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [inputData, setInputData] = useState('')
  const [loading, setLoading] = useState(false)

  const loadAgents = async () => {
    try {
      const agentsApi = createAgentsApi(getToken)
      const response = await agentsApi.getAll()
      setAgents(response.data)
      if (response.data.length > 0) {
        setSelectedAgent(response.data[0].id)
      }
    } catch (error) {
      console.error('Error loading agents:', error)
    }
  }

  useEffect(() => {
    if (open) {
      loadAgents()
    }
  }, [open])

  const handleSubmit = async () => {
    if (!selectedAgent || !inputData.trim()) return

    setLoading(true)
    try {
      const executionsApi = createExecutionsApi(getToken)
      await executionsApi.execute(selectedAgent, inputData)
      setOpen(false)
      setInputData('')
      onSuccess?.()
    } catch (error) {
      console.error('Error executing agent:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full" size="lg">
          <Play className="mr-2 h-4 w-4" />
          Execute Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Execute Agent</DialogTitle>
          <DialogDescription>
            Select an agent and provide input data to execute.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="agent">Select Agent</Label>
            <select
              id="agent"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              disabled={loading || agents.length === 0}
            >
              {agents.length === 0 ? (
                <option value="">No agents available</option>
              ) : (
                agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.agent_type})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="input">Input Data</Label>
            <Textarea
              id="input"
              placeholder="Enter your input for the agent to process..."
              className="min-h-[120px]"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedAgent || !inputData.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              'Execute'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}