
import { Client } from "../types";

// Mock data for development
const mockClients: Client[] = [
  {
    key: "0f7e862d-4275-4509-a90b-83b3847f6a77",
    executions: 127,
    discord_id: 123456789012345678,
    hwid: "a1b2c3d4-e5f6-g7h8-i9j0",
    createdAt: "2023-07-15"
  },
  {
    key: "test",
    executions: 42,
    discord_id: 987654321098765432,
    hwid: "z9y8x7w6-v5u4-t3s2-r1q0",
    createdAt: "2023-08-20"
  }
];

// This will be replaced with actual API calls to your backend
export const api = {
  // Authenticate with license key
  authenticate: async (key: string): Promise<Client | null> => {
    console.log("Authenticating with key:", key);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const client = mockClients.find(client => client.key === key);
    return client || null;
  },
  
  // Get recent executions (last 7 days)
  getRecentExecutions: async (key: string): Promise<number> => {
    console.log("Getting recent executions for key:", key);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const client = mockClients.find(client => client.key === key);
    return client ? Math.floor(client.executions * 0.6) : 0; // Assume 60% of executions are recent
  },
  
  // Register a new client (for development)
  registerClient: async (client: Omit<Client, "createdAt">): Promise<Client> => {
    console.log("Registering new client:", client);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newClient: Client = {
      ...client,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    mockClients.push(newClient);
    return newClient;
  }
};
