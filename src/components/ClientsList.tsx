
import React from "react";
import { 
  Laptop, 
  User, 
  Monitor, 
  MapPin,
  Clock,
  Key,
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RobloxClient } from "@/types/clientManager";
import { formatDistanceToNow } from "date-fns";

interface ClientsListProps {
  clients: RobloxClient[];
  selectedClients: string[];
  toggleClientSelection: (clientId: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  selectedClients, 
  toggleClientSelection 
}) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Laptop className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No clients connected</h3>
        <p className="text-muted-foreground mt-1">
          Waiting for Roblox clients to connect...
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-3 pb-2">
        {clients.map((client) => {
          const isSelected = selectedClients.includes(client.id);
          
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded-md border cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card/30 border-border/30 hover:bg-card/50"
              }`}
              onClick={() => toggleClientSelection(client.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md ${isSelected ? "bg-primary/20" : "bg-muted/20"} flex items-center justify-center relative`}>
                    <Laptop className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    {client.online && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{client.name}</h4>
                      <Badge variant={client.online ? "default" : "secondary"} className="text-[10px] px-1 py-0">
                        {client.online ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{client.username}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{client.place}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(client.lastSeen), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isSelected 
                    ? "bg-primary border-primary" 
                    : "bg-background border-muted"
                }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ClientsList;
