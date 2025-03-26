
export interface Client {
  key: string;
  executions: number;
  discord_id: number;
  hwid: string;
  createdAt?: string;
}

export interface AuthContextType {
  client: Client | null;
  isAuthenticated: boolean;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface StatisticsProps {
  recentExecutions: number;
  totalExecutions: number;
}
