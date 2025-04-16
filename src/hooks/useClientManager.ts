
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { RobloxClient } from "@/types/clientManager";
import WebSocketManager from "@/utils/websocketServer";

export const useClientManager = () => {
  const [clients, setClients] = useState<RobloxClient[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const wsManager = WebSocketManager.getInstance();

  // Load initial clients from WebSocket manager
  useEffect(() => {
    // Check if we're in simulation mode
    setIsSimulationMode(wsManager.isInSimulationMode());
    
    // Set up event listeners for client connections/disconnections
    const setupListeners = () => {
      // Handle client connected event
      const onClientConnected = (client: any) => {
        setClients(prev => {
          // Check if client already exists
          const exists = prev.some(c => c.id === client.id);
          if (exists) {
            // Update existing client
            return prev.map(c => c.id === client.id ? {
              ...c,
              online: true,
              lastSeen: new Date().toISOString()
            } : c);
          } else {
            // Add new client
            return [...prev, {
              id: client.id,
              name: `Client ${client.username}`,
              username: client.username,
              place: client.place,
              online: true,
              lastSeen: new Date().toISOString()
            }];
          }
        });
      };

      // Handle client disconnected event
      const onClientDisconnected = (client: any) => {
        setClients(prev => 
          prev.map(c => c.id === client.id ? {
            ...c,
            online: false,
            lastSeen: new Date().toISOString()
          } : c)
        );
      };

      // Handle client status changed event
      const onClientStatusChanged = (client: any) => {
        setClients(prev => 
          prev.map(c => c.id === client.id ? {
            ...c,
            online: client.online,
            lastSeen: new Date().toISOString()
          } : c)
        );
      };
      
      // Handle simulation mode activated
      const onSimulationModeActivated = () => {
        setIsSimulationMode(true);
        toast.info("Simulation mode activated", {
          description: "Using simulated clients for demonstration."
        });
      };

      // Register event listeners
      const unsubscribeConnected = wsManager.on('clientConnected', onClientConnected);
      const unsubscribeDisconnected = wsManager.on('clientDisconnected', onClientDisconnected);
      const unsubscribeStatusChanged = wsManager.on('clientStatusChanged', onClientStatusChanged);
      const unsubscribeSimulation = wsManager.on('simulationModeActivated', onSimulationModeActivated);

      // Initial clients load
      const connectedClients = wsManager.getConnectedClients();
      const formattedClients = connectedClients.map(client => ({
        id: client.id,
        name: `Client ${client.username}`,
        username: client.username,
        place: client.place,
        online: client.online,
        lastSeen: client.lastSeen
      }));
      
      setClients(formattedClients);

      // Cleanup function
      return () => {
        unsubscribeConnected();
        unsubscribeDisconnected();
        unsubscribeStatusChanged();
        unsubscribeSimulation();
      };
    };

    const cleanup = setupListeners();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

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
    
    // Refresh from WebSocket manager
    const connectedClients = wsManager.getConnectedClients();
    const formattedClients = connectedClients.map(client => ({
      id: client.id,
      name: `Client ${client.username}`,
      username: client.username,
      place: client.place,
      online: client.online,
      lastSeen: client.lastSeen
    }));
    
    setClients(formattedClients);
    setIsRefreshing(false);
    toast.success("Client list refreshed");
  }, []);

  // Send command to selected clients
  const sendCommand = useCallback((command: string) => {
    if (selectedClients.length === 0) {
      toast.error("No clients selected");
      return;
    }
    
    // Send command to selected clients via WebSocket manager
    wsManager.sendCommandToClients(selectedClients, command);
    
    const modeText = isSimulationMode ? " (Simulation)" : "";
    toast.success(`Command sent to ${selectedClients.length} client(s)${modeText}`, {
      description: `Command: ${command}`,
    });
    
    // Notify when the command is successful for debugging
    window.postMessage({ 
      type: "EXECUTE_LUA_MULTIPLE", 
      clients: selectedClients,
      command: command
    }, "*");
  }, [selectedClients, isSimulationMode]);

  return {
    clients,
    selectedClients,
    isRefreshing,
    isSimulationMode,
    sendCommand,
    toggleClientSelection,
    selectAllClients,
    deselectAllClients,
    refreshClients,
  };
};

