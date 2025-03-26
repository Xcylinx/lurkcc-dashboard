
import { Client } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Calendar, Hash, Shield } from "lucide-react";
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
  
  const infoItems = [
    {
      label: "License Key",
      value: showKey ? client.key : client.key.substring(0, 4) + "..." + client.key.substring(client.key.length - 4),
      icon: showKey ? EyeOff : Eye,
      action: () => setShowKey(!showKey),
      color: "text-blue-400"
    },
    {
      label: "Discord ID",
      value: formatDiscordId(client.discord_id),
      icon: User,
      color: "text-purple-400"
    },
    {
      label: "Hardware ID",
      value: client.hwid,
      icon: Hash,
      color: "text-cyan-400"
    },
    {
      label: "Created",
      value: formatDate(client.createdAt),
      icon: Calendar,
      color: "text-green-400"
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="w-full"
      whileHover={{ 
        boxShadow: "0 0 15px 0 rgba(138, 75, 175, 0.2)",
        transition: { duration: 0.2 } 
      }}
    >
      <Card className="glass-morphism border-white/5">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Client Information</CardTitle>
              <CardDescription>Details about your account</CardDescription>
            </div>
            <motion.div
              className="h-10 w-10 rounded-full glass-morphism flex items-center justify-center"
              animate={{
                boxShadow: ["0 0 0px rgba(139, 92, 246, 0.3)", "0 0 10px rgba(139, 92, 246, 0.5)", "0 0 0px rgba(139, 92, 246, 0.3)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Shield className="h-5 w-5 text-purple-400" />
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              {infoItems.map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="glass-morphism border border-white/5 rounded-lg p-4 backdrop-blur-md relative overflow-hidden group"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        {item.label}
                      </p>
                      <p className="font-mono text-white truncate text-sm group-hover:text-gradient transition-all duration-300">
                        {item.value}
                      </p>
                    </div>
                    
                    {item.action && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 bg-white/5 hover:bg-white/10"
                        onClick={item.action}
                      >
                        <motion.div
                          initial={false}
                          animate={{ 
                            opacity: [1, 0, 1], 
                            scale: [1, 0.8, 1],
                            rotate: showKey ? 180 : 0
                          }}
                          transition={{ 
                            duration: 0.3, 
                            times: [0, 0.5, 1] 
                          }}
                        >
                          <item.icon className="h-3 w-3" />
                        </motion.div>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientInfo;
