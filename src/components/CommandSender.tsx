
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Terminal, ArrowUpCircle, Wand2, InfoIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting");

  // Check WebSocket connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Attempt to create a test WebSocket connection
        const testWs = new WebSocket("wss://lurkcc-dashboard.lovable.app/ws");
        
        testWs.onopen = () => {
          setConnectionStatus("connected");
          testWs.close(); // Close test connection
          toast.success("WebSocket server is online");
        };
        
        testWs.onerror = () => {
          setConnectionStatus("error");
          toast.error("WebSocket server is offline", {
            description: "Make sure the server is running at lurkcc-dashboard.lovable.app"
          });
        };
      } catch (error) {
        setConnectionStatus("error");
        toast.error("WebSocket connection failed", {
          description: "Check browser console for details"
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
              "bg-red-500"
            }`} 
          />
          <span className="text-xs text-muted-foreground">
            WebSocket: {
              connectionStatus === "connected" ? "Connected" : 
              connectionStatus === "connecting" ? "Connecting..." : 
              "Offline"
            }
          </span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="sr-only">Connection Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs max-w-[250px]">
                Connect Roblox clients to:<br/>
                <code className="text-xs bg-muted p-0.5 rounded">wss://lurkcc-dashboard.lovable.app/ws</code>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Command input */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={disabled ? "Select clients first..." : "Type a command..."}
          className="pr-12 font-mono text-sm bg-background/80 border-border focus-visible:border-primary/50 h-10"
          disabled={disabled || connectionStatus === "error"}
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
                    disabled={disabled || !command.trim() || connectionStatus === "error"}
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
