
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { logout, client } = useAuth();
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full glass-morphism sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        <h1 className="text-xl font-bold tracking-tight text-gradient">
          lurk.cc
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {client && (
          <p className="text-sm text-muted-foreground hidden sm:block">
            Key: <span className="font-mono">{client.key.substring(0, 8)}...</span>
          </p>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="bg-white/5 hover:bg-white/10"
        >
          <motion.div
            initial={false}
            animate={{ opacity: [1, 0, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 0.3, times: [0, 0.5, 1] }}
            key="logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
          </motion.div>
          Logout
        </Button>
      </div>
    </motion.header>
  );
};

export default Navbar;
