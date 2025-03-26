
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import Statistics from "../components/Statistics";
import CodeBox from "../components/CodeBox";
import ClientInfo from "../components/ClientInfo";
import { api } from "../services/api";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, Bookmark } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Dashboard = () => {
  const { client } = useAuth();
  const [recentExecutions, setRecentExecutions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/80 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/5 backdrop-blur-3xl"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
              ],
              y: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
              ],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gradient mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your performance and access your client information
          </p>
        </motion.div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Statistics 
              recentExecutions={recentExecutions}
              totalExecutions={client.executions}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CodeBox licenseKey={client.key} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ClientInfo client={client} />
          </motion.div>
          
          <Collapsible
            open={showExtraInfo}
            onOpenChange={setShowExtraInfo}
            className="w-full"
          >
            <CollapsibleTrigger className="w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-morphism p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">Additional Resources</span>
                </div>
                <motion.div
                  animate={{ rotate: showExtraInfo ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {showExtraInfo ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </motion.div>
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 glass-morphism mt-2 rounded-lg"
              >
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-purple-400" />
                    <span>Documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-purple-400" />
                    <span>Discord Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-purple-400" />
                    <span>Video Tutorials</span>
                  </li>
                </ul>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
      
      {/* Animated footer accent */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-white/30"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
