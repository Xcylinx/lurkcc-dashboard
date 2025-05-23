
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  RefreshCw,
  Check,
  X,
  Skull,
  Eye,
  EyeOff,
  Trash2,
  Flame,
  Shield,
  Code,
  Copy,
  ServerCrash,
  Server,
} from "lucide-react";
import CommandSender from "@/components/CommandSender";
import ClientsList from "@/components/ClientsList";
import { useClientManager } from "@/hooks/useClientManager";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import WebSocketManager from "@/utils/websocketServer";

const ClientManager = () => {
  const {
    clients,
    selectedClients,
    isRefreshing,
    sendCommand,
    toggleClientSelection,
    selectAllClients,
    deselectAllClients,
    refreshClients,
  } = useClientManager();

  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  // Check if we're in simulation mode
  useEffect(() => {
    const wsManager = WebSocketManager.getInstance();
    setIsSimulationMode(wsManager.isInSimulationMode());
    
    // Listen for simulation mode changes
    const unsubscribe = wsManager.on('simulationModeActivated', () => {
      setIsSimulationMode(true);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const copyLuaCode = () => {
    const luaCode = `
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Function to establish WebSocket connection
local function connectToWebSocket()
    local websocket
    
    -- Try to create a WebSocket connection
    local success, error = pcall(function()
        websocket = WebSocket.connect("https://bubble.tools/")
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
end)`;

    navigator.clipboard.writeText(luaCode);
    toast.success("Lua code copied to clipboard", {
      description: "Paste this into your Roblox executor or script"
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 text-left"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">Client Manager</h1>
          <p className="text-muted-foreground">Manage and control your Roblox clients remotely</p>
        </motion.div>

        {isSimulationMode && (
          <Alert className="mb-6 bg-blue-500/10 border-blue-500/30">
            <ServerCrash className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">Simulation Mode Active</AlertTitle>
            <AlertDescription>
              The WebSocket server at <code className="text-xs bg-muted p-0.5 rounded">wss://lurkcc-dashboard.lovable.app/ws</code> is not available. 
              Using simulated clients for demonstration purposes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Client list */}
          <Card className="lg:col-span-2 border-white/5 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Connected Clients
                    {isSimulationMode && (
                      <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full">
                        Simulated
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Select clients to send commands
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllClients}
                    className="text-xs"
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deselectAllClients}
                    className="text-xs"
                  >
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    Deselect All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshClients}
                    disabled={isRefreshing}
                    className="text-xs"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ClientsList 
                clients={clients} 
                selectedClients={selectedClients} 
                toggleClientSelection={toggleClientSelection} 
              />
            </CardContent>
          </Card>

          {/* Right panel - Command center */}
          <div className="space-y-6">
            <Card className="border-white/5 overflow-hidden">
              <CardHeader>
                <CardTitle>Command Center</CardTitle>
                <CardDescription>
                  {selectedClients.length === 0 
                    ? "Select clients to send commands" 
                    : `Send commands to ${selectedClients.length} selected client${selectedClients.length > 1 ? 's' : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommandSender 
                  selectedClients={selectedClients}
                  sendCommand={sendCommand}
                  disabled={selectedClients.length === 0}
                />
                
                {selectedClients.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground mb-2">Quick Commands:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => sendCommand("loopkill")}
                        className="text-xs"
                      >
                        <Skull className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                        Loop Kill
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => sendCommand("hide")}
                        className="text-xs"
                      >
                        <EyeOff className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                        Hide
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => sendCommand("unhide")}
                        className="text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                        Unhide
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => sendCommand("noclip")}
                        className="text-xs"
                      >
                        <Shield className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                        Noclip
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => sendCommand("crash")}
                        className="text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                        Crash
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => sendCommand("godmode")}
                        className="text-xs"
                      >
                        <Flame className="h-3.5 w-3.5 mr-1.5 text-yellow-400" />
                        God Mode
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Connection Guide */}
            <Card className="border-white/5 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Connection Guide
                </CardTitle>
                <CardDescription>
                  How to connect Roblox clients to this dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">WebSocket URL</h3>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted p-2 rounded text-xs font-mono flex-1">
                        wss://lurkcc-dashboard.lovable.app/ws
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText("wss://lurkcc-dashboard.lovable.app/ws");
                                toast.success("WebSocket URL copied");
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Copy URL</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  {isSimulationMode && (
                    <Alert className="bg-blue-500/10 border-blue-500/30">
                      <ServerCrash className="h-4 w-4 text-blue-500" />
                      <AlertTitle className="text-blue-500">No WebSocket Server Detected</AlertTitle>
                      <AlertDescription className="text-xs">
                        To use real clients, you need to deploy a WebSocket server at the URL above. 
                        The application will fall back to simulation mode for demonstration purposes.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Payload Format</h3>
                    <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
{`{
  "action": "client_connected",
  "data": {
    "userId": 123,
    "username": "PlayerName",
    "place": "GameName",
    "money": 1000
  }
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/10 pt-4">
                <Button 
                  onClick={copyLuaCode}
                  variant="secondary" 
                  className="w-full text-xs"
                >
                  <Code className="mr-2 h-4 w-4" />
                  Copy Lua Connection Code
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
