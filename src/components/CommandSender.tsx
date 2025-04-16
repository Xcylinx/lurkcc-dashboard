
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Terminal, ArrowUpCircle, Wand2, InfoIcon, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommandSenderProps {
  selectedClients: string[];
  sendCommand: (command: string) => void;
  disabled?: boolean;
}

const CommandSender: React.FC<CommandSenderProps> = ({ 
  selectedClients, 
  sendCommand,
  disabled = false
}) => {
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error" | "simulation">("connecting");
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);

  // Check WebSocket connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Display connecting status
        setConnectionStatus("connecting");
        toast.info("Checking WebSocket server status...");
        
        // Attempt to create a test WebSocket connection
        const testWs = new WebSocket("wss://lurkcc-dashboard.lovable.app/ws");
        
        testWs.onopen = () => {
          setConnectionStatus("connected");
          testWs.close(); // Close test connection
          toast.success("WebSocket server is online");
        };
        
        testWs.onerror = () => {
          console.log("WebSocket connection failed, falling back to simulation mode");
          setConnectionStatus("simulation");
          toast.info("Using simulation mode", {
            description: "WebSocket server is not available. Using simulated clients."
          });
        };
        
        // Set a timeout to handle cases where the connection hangs
        setTimeout(() => {
          if (connectionStatus === "connecting") {
            setConnectionStatus("simulation");
            toast.info("Connection timeout, using simulation mode");
            if (testWs.readyState === WebSocket.CONNECTING) {
              testWs.close();
            }
          }
        }, 5000);
      } catch (error) {
        console.error("WebSocket connection test failed:", error);
        setConnectionStatus("simulation");
        toast.info("Using simulation mode", {
          description: "WebSocket server initialization failed. Using simulated clients."
        });
      }
    };
    
    checkConnection();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim() || disabled) return;
    
    // Send the command
    sendCommand(command);
    
    // Add to history
    setCommandHistory(prev => [command, ...prev.slice(0, 9)]);
    
    // Clear input
    setCommand("");
    
    // Focus input again
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div 
            className={`h-2 w-2 rounded-full ${
              connectionStatus === "connected" ? "bg-green-500" : 
              connectionStatus === "connecting" ? "bg-yellow-500 animate-pulse" : 
              connectionStatus === "simulation" ? "bg-blue-500" :
              "bg-red-500"
            }`} 
          />
          <span className="text-xs text-muted-foreground">
            {connectionStatus === "connected" ? "WebSocket: Connected" : 
             connectionStatus === "connecting" ? "WebSocket: Connecting..." : 
             connectionStatus === "simulation" ? "Simulation Mode" : 
             "WebSocket: Offline"}
          </span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setShowConnectionInfo(true)}
              >
                <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="sr-only">Connection Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs max-w-[250px]">
                Connection Information
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Connection Info Dialog */}
        <AlertDialog open={showConnectionInfo} onOpenChange={setShowConnectionInfo}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>WebSocket Connection</AlertDialogTitle>
              <AlertDialogDescription>
                {connectionStatus === "connected" ? (
                  <div>
                    <p className="mb-2">Your WebSocket server is active. Roblox clients can connect to:</p>
                    <code className="bg-muted p-2 rounded block text-xs font-mono mb-2">
                      wss://lurkcc-dashboard.lovable.app/ws
                    </code>
                  </div>
                ) : connectionStatus === "simulation" ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-blue-500">
                      <AlertCircle className="h-4 w-4" />
                      <p className="font-medium">Using Simulation Mode</p>
                    </div>
                    <p className="mb-2">
                      The WebSocket server at <code className="text-xs bg-muted p-0.5 rounded">wss://lurkcc-dashboard.lovable.app/ws</code> is 
                      not available. The application is using simulated clients for demonstration.
                    </p>
                    <p className="mb-2">
                      To use real clients, you need to deploy a WebSocket server to handle client connections.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <p className="font-medium">Connection Error</p>
                    </div>
                    <p>
                      Unable to connect to the WebSocket server. Please check your server status and ensure it's running at:
                    </p>
                    <code className="bg-muted p-2 rounded block text-xs font-mono my-2">
                      wss://lurkcc-dashboard.lovable.app/ws
                    </code>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Command input */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={disabled ? "Select clients first..." : "Type a command..."}
          className="pr-12 font-mono text-sm bg-background/80 border-border focus-visible:border-primary/50 h-10"
          disabled={disabled}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="submit" 
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-primary hover:text-primary/90 hover:bg-primary/10 focus:bg-primary/5 transition-colors"
                    disabled={disabled || !command.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Send command</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
      
      {/* Command history */}
      {commandHistory.length > 0 && (
        <div className="rounded-md border border-border/40 overflow-hidden shadow-sm">
          <div className="bg-muted/30 px-3 py-1.5 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary/70" />
              <span className="text-xs font-medium">Command History</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs hover:bg-background/60"
              onClick={() => setCommandHistory([])}
            >
              Clear
            </Button>
          </div>
          
          <ScrollArea className="h-[150px]">
            <div className="p-2 space-y-1.5">
              {commandHistory.map((cmd, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/20 group cursor-pointer transition-colors"
                  onClick={() => setCommand(cmd)}
                >
                  <Wand2 className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-xs font-mono flex-1 truncate">{cmd}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommand(cmd);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <ArrowUpCircle className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CommandSender;
