
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
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private isSimulationMode: boolean = false;

  private constructor() {
    // Use the deployed app URL for WebSocket connection
    this.wsUrl = this.getWebSocketUrl();
    
    // Initialize WebSocket server if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.setupServer();
    }
  }

  private getWebSocketUrl(): string {
    // Updated to use the new URL
    return 'https://bubblebot.tools/';
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
      // Always try to connect to real server first
      this.connectToServer();
      
      // If connection fails, simulation mode will be activated in the connectToServer error handling
    } catch (error) {
      console.error("Error setting up WebSocket server:", error);
      // Fallback to simulation in case of error
      this.activateSimulationMode();
    }

    // Listen for window unload to properly close connections
    window.addEventListener('beforeunload', () => {
      if (this.server) {
        this.server.close();
      }
      
      this.clients.forEach(client => {
        if (client.socket) {
          client.socket.close();
        }
      });
    });
  }

  private connectToServer() {
    if (this.isConnecting) return;
    
    this.isConnecting = true;
    console.log(`Attempting to connect to WebSocket server at ${this.wsUrl}`);
    
    try {
      const socket = new WebSocket(this.wsUrl);
      
      socket.onopen = () => {
        console.log("WebSocket connection established");
        this.server = socket;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.isSimulationMode = false;
        
        // Emit connection event
        this.emit('serverConnected', { status: 'connected' });
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
        this.isConnecting = false;
        
        // Emit disconnection event
        this.emit('serverDisconnected', { status: 'disconnected' });
        
        // Attempt to reconnect after a delay if we haven't exceeded max attempts
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          console.log(`Reconnecting in ${delay/1000} seconds (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          setTimeout(() => this.connectToServer(), delay);
        } else {
          console.log("Max reconnection attempts reached, falling back to simulation");
          this.activateSimulationMode();
        }
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        if (socket.readyState !== WebSocket.CLOSED) {
          socket.close();
        }
        
        // If this is the first error, fall back to simulation immediately
        if (this.reconnectAttempts === 0) {
          this.activateSimulationMode();
        }
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket server:", error);
      this.isConnecting = false;
      this.activateSimulationMode();
    }
  }

  private activateSimulationMode() {
    if (!this.isSimulationMode) {
      console.log("Using simulated clients for development");
      this.isSimulationMode = true;
      this.simulateClientConnections();
      
      // Emit simulation mode event
      this.emit('simulationModeActivated', { status: 'simulation' });
    }
  }

  // Method to check if the manager is in simulation mode
  public isInSimulationMode(): boolean {
    return this.isSimulationMode;
  }

  // Method to check if the server is connected
  public isServerConnected(): boolean {
    return this.server !== null && this.server.readyState === WebSocket.OPEN;
  }

  // Method to manually initiate a connection
  public connect(): void {
    if (!this.isServerConnected() && !this.isConnecting) {
      this.connectToServer();
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

// Lua code reference is kept but omitted for brevity
