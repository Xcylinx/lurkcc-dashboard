
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import Statistics from "../components/Statistics";
import CodeBox from "../components/CodeBox";
import ClientInfo from "../components/ClientInfo";
import { api } from "../services/api";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { client } = useAuth();
  const [recentExecutions, setRecentExecutions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (client) {
      setIsLoading(true);
      api.getRecentExecutions(client.key)
        .then(setRecentExecutions)
        .catch(error => {
          console.error("Failed to fetch recent executions:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [client]);
  
  if (!client) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black/70 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold tracking-tight text-gradient mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-muted-foreground">
            View your client statistics and information
          </p>
        </motion.div>
        
        <div className="space-y-6">
          <Statistics 
            recentExecutions={recentExecutions}
            totalExecutions={client.executions}
          />
          
          <CodeBox licenseKey={client.key} />
          
          <ClientInfo client={client} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
