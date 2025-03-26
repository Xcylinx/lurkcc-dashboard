
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  ChevronDown,
  User,
  Key,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, client } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full glass-morphism sticky top-0 z-10 border-b border-white/5"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and branding */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <motion.div
                className="h-8 w-8 rounded-md glass-morphism flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(139, 92, 246, 0.2)",
                    "0 0 8px rgba(139, 92, 246, 0.4)",
                    "0 0 0px rgba(139, 92, 246, 0.2)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Shield className="h-4 w-4 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-xl font-bold tracking-tight text-gradient hidden sm:block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                lurk.cc
              </motion.h1>
            </Link>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {client && (
              <div className="flex items-center gap-4">
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md glass-morphism border border-white/5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <User className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-muted-foreground">ID: <span className="font-mono">{client.discord_id.toString().substring(0, 6)}...</span></span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md glass-morphism border border-white/5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Key className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-muted-foreground">Key: <span className="font-mono">{client.key.substring(0, 8)}...</span></span>
                </motion.div>
              </div>
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="bg-white/5 hover:bg-white/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="flex items-center gap-2">
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: [1, 0, 1], 
                      scale: [1, 0.8, 1] 
                    }}
                    transition={{ 
                      duration: 0.3, 
                      times: [0, 0.5, 1] 
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-medium">Logout</span>
                </span>
              </Button>
            </motion.div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white/5 hover:bg-white/10 h-9 w-9 p-0"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-morphism border-t border-white/5 overflow-hidden z-20"
          >
            <div className="container mx-auto px-4 py-3 space-y-3">
              {client && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md glass-morphism border border-white/5">
                    <User className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-muted-foreground">Discord ID: <span className="font-mono">{client.discord_id.toString().substring(0, 6)}...</span></span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md glass-morphism border border-white/5">
                    <Key className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-muted-foreground">License Key: <span className="font-mono">{client.key.substring(0, 8)}...</span></span>
                  </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full bg-white/5 hover:bg-white/10 justify-start gap-2"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                <span>Logout</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
