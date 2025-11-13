import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AgentType {
  RESEARCHER: string;
  CODER: string;
  ANALYST: string;
  WRITER: string;
  MARKETER: string;
  DEBUGGER: string;
  REVIEWER: string;
  CUSTOM: string;
}

export interface Agent {
  id: string;
  name: string;
  agent_type: string;
  description: string;
  system_prompt: string;
  capabilities: string[];
  model: string;
  temperature: string;
  max_tokens: string;
  agent_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_agent_id: string | null;
  result: Record<string, any>;
  error: string | null;
  task_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Execution {
  id: string;
  agent_id: string;
  input_data: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output: string | null;
  error: string | null;
  execution_time: string | null;
  execution_metadata: Record<string, any>;
  created_at: string;
  completed_at: string | null;
}

export const agentsApi = {
  getAll: () => api.get<Agent[]>('/api/agents'),
  getById: (id: string) => api.get<Agent>(`/api/agents/${id}`),
  create: (data: any) => api.post<Agent>('/api/agents/create', data),
  createFromTemplate: (agentType: string, name: string, description?: string) =>
    api.post<Agent>('/api/agents/create-from-template', null, {
      params: { agent_type: agentType, name, description }
    }),
  update: (id: string, data: any) => api.put<Agent>(`/api/agents/${id}`, data),
  delete: (id: string) => api.delete(`/api/agents/${id}`),
};

export const tasksApi = {
  create: (description: string, metadata?: Record<string, any>) =>
    api.post<Task>('/api/tasks/create', { description, task_metadata: metadata || {} }),
  getById: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  getResult: (id: string) => api.get(`/api/tasks/${id}/result`),
  getAll: () => api.get<Task[]>('/api/tasks'),
  delete: (id: string) => api.delete(`/api/tasks/${id}`),
};

export const executionsApi = {
  execute: (agentId: string, inputData: string, metadata?: Record<string, any>) =>
    api.post<Execution>('/api/executions/execute', {
      agent_id: agentId,
      input_data: inputData,
      execution_metadata: metadata || {}
    }),
  getById: (id: string) => api.get<Execution>(`/api/executions/${id}`),
  getAll: (agentId?: string) =>
    api.get<Execution[]>('/api/executions', { params: { agent_id: agentId } }),
  delete: (id: string) => api.delete(`/api/executions/${id}`),
};
