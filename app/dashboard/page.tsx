'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Bot, Sparkles, History, Play, TrendingUp, Zap } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateTaskDialog } from '@/components/create-task-dialog'
import { CreateAgentDialog } from '@/components/create-agent-dialog'
import { ExecuteAgentDialog } from '@/components/execute-agent-dialog'
import { AgentsList } from '@/components/agents-list'
import { TasksList } from '@/components/tasks-list'
import { ExecutionsList } from '@/components/executions-list'
import { createAgentsApi, createTasksApi, createExecutionsApi } from '@/lib/api'

export default function Home() {
  const { getToken } = useAuth()
  const [activeTab, setActiveTab] = useState('agents')
  const [stats, setStats] = useState({ agents: 0, tasks: 0, executions: 0 })
  
  const loadStats = async () => {
    try {
      const agentsApi = createAgentsApi(getToken)
      const tasksApi = createTasksApi(getToken)
      const executionsApi = createExecutionsApi(getToken)
      
      const [agentsRes, tasksRes, executionsRes] = await Promise.all([
        agentsApi.getAll(),
        tasksApi.getAll(),
        executionsApi.getAll(),
      ])
      setStats({
        agents: agentsRes.data.length,
        tasks: tasksRes.data.length,
        executions: executionsRes.data.length,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative container mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative p-3 bg-gradient-to-br from-primary to-primary/50 rounded-2xl shadow-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Agent Creator
              </h1>
              <p className="text-sm text-muted-foreground">Orchestrate intelligent autonomous agents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        <div className="grid gap-4 mb-8 md:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Agents</CardTitle>
                <Bot className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.agents}</div>
              <p className="text-xs text-muted-foreground mt-1">Active AI agents</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-blue-500/5 hover:border-blue-500/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                <Sparkles className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.tasks}</div>
              <p className="text-xs text-muted-foreground mt-1">Tasks created</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-green-500/5 hover:border-green-500/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Executions</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.executions}</div>
              <p className="text-xs text-muted-foreground mt-1">Total runs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card hover:border-primary/40 transition-all hover:shadow-xl group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Create Task</CardTitle>
                  <CardDescription className="text-xs">AI generates perfect agent</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CreateTaskDialog onSuccess={loadStats} />
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-card hover:border-primary/40 transition-all hover:shadow-xl group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <Bot className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Create Agent</CardTitle>
                  <CardDescription className="text-xs">Custom agent configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CreateAgentDialog onSuccess={loadStats} />
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-card hover:border-primary/40 transition-all hover:shadow-xl group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                  <Zap className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Execute Agent</CardTitle>
                  <CardDescription className="text-xs">Run existing agent</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ExecuteAgentDialog onSuccess={loadStats} />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-muted/50">
            <TabsTrigger value="agents" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Bot className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Sparkles className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="executions" className="flex items-center gap-2 data-[state=active]:bg-background">
              <History className="h-4 w-4" />
              Executions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <AgentsList onDelete={loadStats} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <TasksList onDelete={loadStats} />
          </TabsContent>

          <TabsContent value="executions" className="space-y-4">
            <ExecutionsList onDelete={loadStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}