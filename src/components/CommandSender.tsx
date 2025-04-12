
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Terminal, ArrowUpCircle, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      {/* Command input */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={disabled ? "Select clients first..." : "Type a command..."}
          className="pr-24 font-mono text-sm bg-background/80 border-primary/20 focus-visible:border-primary/50 h-10"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-1 top-1 h-8 bg-primary hover:bg-primary/90 border-none shadow-md"
          disabled={disabled || !command.trim()}
        >
          <Send className="h-3.5 w-3.5 mr-1.5" />
          Execute
        </Button>
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
