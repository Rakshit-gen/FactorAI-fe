import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const createApiClient = async (getToken: () => Promise<string | null>) => {
  const token = await getToken();
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
};

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

export const createAgentsApi = (getToken: () => Promise<string | null>) => ({
  getAll: async () => {
    const api = await createApiClient(getToken);
    return api.get<Agent[]>('/api/agents');
  },
  getById: async (id: string) => {
    const api = await createApiClient(getToken);
    return api.get<Agent>(`/api/agents/${id}`);
  },
  create: async (data: any) => {
    const api = await createApiClient(getToken);
    return api.post<Agent>('/api/agents/create', data);
  },
  createFromTemplate: async (agentType: string, name: string, description?: string) => {
    const api = await createApiClient(getToken);
    return api.post<Agent>('/api/agents/create-from-template', null, {
      params: { agent_type: agentType, name, description }
    });
  },
  update: async (id: string, data: any) => {
    const api = await createApiClient(getToken);
    return api.put<Agent>(`/api/agents/${id}`, data);
  },
  delete: async (id: string) => {
    const api = await createApiClient(getToken);
    return api.delete(`/api/agents/${id}`);
  },
});

export const createTasksApi = (getToken: () => Promise<string | null>) => ({
  create: async (description: string, metadata?: Record<string, any>) => {
    const api = await createApiClient(getToken);
    return api.post<Task>('/api/tasks/create', { description, task_metadata: metadata || {} });
  },
  getById: async (id: string) => {
    const api = await createApiClient(getToken);
    return api.get<Task>(`/api/tasks/${id}`);
  },
  getResult: async (id: string) => {
    const api = await createApiClient(getToken);
    return api.get(`/api/tasks/${id}/result`);
  },
  getAll: async () => {
    const api = await createApiClient(getToken);
    return api.get<Task[]>('/api/tasks');
  },
  delete: async (id: string) => {
    const api = await createApiClient(getToken);
    return api.delete(`/api/tasks/${id}`);
  },
});

export const createExecutionsApi = (getToken: () => Promise<string | null>) => ({
  execute: async (agentId: string, inputData: string, metadata?: Record<string, any>) => {
    const api = await createApiClient(getToken);
    return api.post<Execution>('/api/executions/execute', {
      agent_id: agentId,
      input_data: inputData,
      execution_metadata: metadata || {}
    });
  },
  getById: async (id: string) => {
    const api = await createApiClient(getToken);
    return api.get<Execution>(`/api/executions/${id}`);
  },
  getAll: async (agentId?: string) => {
    const api = await createApiClient(getToken);
    return api.get<Execution[]>('/api/executions', { params: { agent_id: agentId } });
  },
  delete: async (id: string) => {
    const api = await createApiClient(getToken);
    return api.delete(`/api/executions/${id}`);
  },
});