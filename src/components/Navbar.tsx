
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const { logout, client } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full glass-morphism sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-white/5"
    >
      <div className="flex items-center">
        <motion.h1 
          className="text-xl font-bold tracking-tight text-gradient relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          lurk.cc
          <motion.div 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
        </motion.h1>
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
      
      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-4">
        {client && (
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Key: <span className="font-mono">{client.key.substring(0, 8)}...</span>
          </motion.p>
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
        </motion.div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 glass-morphism border-t border-white/5 mt-px overflow-hidden z-20"
          >
            <div className="p-4 flex flex-col gap-2">
              {client && (
                <p className="text-sm text-muted-foreground">
                  Key: <span className="font-mono">{client.key.substring(0, 8)}...</span>
                </p>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="bg-white/5 hover:bg-white/10 justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
