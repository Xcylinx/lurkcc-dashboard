
import { Client } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ClientInfoProps {
  client: Client;
}

const ClientInfo = ({ client }: ClientInfoProps) => {
  const [showKey, setShowKey] = useState(false);
  
  // Format discord ID for display
  const formatDiscordId = (id: number) => {
    const idStr = id.toString();
    return idStr.length > 8 ? `${idStr.substring(0, 8)}...` : idStr;
  };
  
  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="w-full"
    >
      <Card className="glass-morphism">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Client Information</CardTitle>
              <CardDescription>Details about your account</CardDescription>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10"
              onClick={() => setShowKey(!showKey)}
            >
              <motion.div
                initial={false}
                animate={{ opacity: [1, 0, 1], scale: [1, 0.8, 1] }}
                transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                key={showKey ? "eyeoff" : "eye"}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </motion.div>
              <span className="sr-only">{showKey ? "Hide" : "Show"} key</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">License Key</p>
                <p className="font-mono text-white truncate">
                  {showKey ? client.key : client.key.substring(0, 4) + "..." + client.key.substring(client.key.length - 4)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Discord ID</p>
                <p className="font-mono text-white">
                  {formatDiscordId(client.discord_id)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Hardware ID</p>
                <p className="font-mono text-white truncate">
                  {client.hwid}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
                <p className="font-mono text-white">
                  {formatDate(client.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientInfo;
