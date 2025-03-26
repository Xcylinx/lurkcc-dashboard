
import { Client } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ClientInfoProps {
  client: Client;
}

const ClientInfo = ({ client }: ClientInfoProps) => {
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
          <CardTitle className="text-lg">Client Information</CardTitle>
          <CardDescription>Details about your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">License Key</p>
                <p className="font-mono text-white truncate">
                  {client.key}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Discord ID</p>
                <p className="font-mono text-white">
                  {formatDiscordId(client.discord_id)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hardware ID</p>
                <p className="font-mono text-white truncate">
                  {client.hwid}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
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
