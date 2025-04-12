
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { RobloxClient } from "@/types/clientManager";

// Mock data for demonstration purposes
const mockClients: RobloxClient[] = [
  {
    id: "client-1",
    name: "Client 1",
    username: "PlayerOne",
    place: "Natural Disaster Survival",
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "client-2",
    name: "Client 2",
    username: "PlayerTwo",
    place: "Adopt Me!",
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "client-3",
    name: "Client 3",
    username: "PlayerThree",
    place: "Brookhaven",
    online: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "client-4",
    name: "Client 4",
    username: "PlayerFour",
    place: "Arsenal",
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "client-5",
    name: "Client 5",
    username: "PlayerFive",
    place: "Murder Mystery 2",
    online: true,
    lastSeen: new Date().toISOString(),
  },
];

export const useClientManager = () => {
  const [clients, setClients] = useState<RobloxClient[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial clients (mock data for demonstration)
  useEffect(() => {
    // In a real application, this would be a WebSocket connection
    // that listens for client connections/disconnections
    setClients(mockClients);
    
    // Set up websocket listener for client updates
    setupWebSocketListener();
    
    return () => {
      // Clean up websocket connection when component unmounts
      cleanupWebSocketListener();
    };
  }, []);

  // Mock function to simulate WebSocket connection setup
  const setupWebSocketListener = () => {
    // In a real application, this would set up a WebSocket connection
    console.log("Setting up WebSocket listener for client updates");
    
    // This would normally be a WebSocket event handler
    const mockClientUpdateInterval = setInterval(() => {
      // Randomly update a client's status for demonstration
      const randomClientIndex = Math.floor(Math.random() * mockClients.length);
      if (Math.random() > 0.7) {
        mockClients[randomClientIndex].online = !mockClients[randomClientIndex].online;
        mockClients[randomClientIndex].lastSeen = new Date().toISOString();
        setClients([...mockClients]);
      }
    }, 20000); // Every 20 seconds
    
    // Store the interval ID for cleanup
    window._mockClientUpdateInterval = mockClientUpdateInterval;
  };

  // Mock function to clean up WebSocket listener
  const cleanupWebSocketListener = () => {
    // Clear the mock update interval
    if (window._mockClientUpdateInterval) {
      clearInterval(window._mockClientUpdateInterval);
    }
    
    // In a real application, this would close the WebSocket connection
    console.log("Cleaning up WebSocket listener");
  };

  // Toggle client selection
  const toggleClientSelection = useCallback((clientId: string) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  }, []);

  // Select all clients
  const selectAllClients = useCallback(() => {
    const onlineClientIds = clients
      .filter(client => client.online)
      .map(client => client.id);
    setSelectedClients(onlineClientIds);
    
    if (onlineClientIds.length === 0) {
      toast.warning("No online clients to select");
    }
  }, [clients]);

  // Deselect all clients
  const deselectAllClients = useCallback(() => {
    setSelectedClients([]);
  }, []);

  // Refresh clients list
  const refreshClients = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real application, this would fetch updated client list
      setIsRefreshing(false);
      toast.success("Client list refreshed");
    }, 1000);
  }, []);

  // Send command to selected clients
  const sendCommand = useCallback((command: string) => {
    if (selectedClients.length === 0) {
      toast.error("No clients selected");
      return;
    }
    
    console.log(`Sending command "${command}" to clients:`, selectedClients);
    
    // Here, you would actually send the command to each client
    // through your WebSocket connection
    
    // In this mock implementation, we'll just show success messages
    toast.success(`Command sent to ${selectedClients.length} client(s)`, {
      description: `Command: ${command}`,
    });
    
    // Notify when the command is successful for debugging
    window.postMessage({ 
      type: "EXECUTE_LUA_MULTIPLE", 
      clients: selectedClients,
      command: command
    }, "*");
  }, [selectedClients]);

  return {
    clients,
    selectedClients,
    isRefreshing,
    sendCommand,
    toggleClientSelection,
    selectAllClients,
    deselectAllClients,
    refreshClients,
  };
};

// Add a declaration for the mock interval to the Window interface
declare global {
  interface Window {
    _mockClientUpdateInterval?: number;
  }
}
