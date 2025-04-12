
export interface RobloxClient {
  id: string;
  name: string;
  username: string;
  place: string;  // The Roblox game they're in
  online: boolean;
  lastSeen: string; // ISO date string
}
