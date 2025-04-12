
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Send,
  X,
  ListFilter,
  RefreshCw,
  TerminalSquare,
  Check,
  Skull,
  Eye,
  EyeOff,
  Trash2,
  Flame,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CommandSender from "@/components/CommandSender";
import ClientsList from "@/components/ClientsList";
import { useClientManager } from "@/hooks/useClientManager";

const ClientManager = () => {
  const { client } = useAuth();
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 text-left"
        >
          <h1 className="text-3xl font-bold text-gradient mb-2">Client Manager</h1>
          <p className="text-muted-foreground">Manage and control your Roblox clients remotely</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Client list */}
          <Card className="lg:col-span-2 glass-morphism border-white/5 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connected Clients</CardTitle>
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
          <Card className="glass-morphism border-white/5 overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
