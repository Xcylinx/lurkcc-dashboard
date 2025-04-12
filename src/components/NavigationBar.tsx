
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { PanelRight, Home, Users, LogOut } from "lucide-react";

const NavigationBar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Client Manager",
      path: "/client-manager",
      icon: Users,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 bottom-0 z-30 flex flex-col p-3 glass-morphism border-r border-white/10",
        expanded ? "w-56" : "w-16"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExpanded(!expanded)}
        className="absolute right-0 -mr-4 mt-6 bg-background/80 border border-white/10 rounded-full shadow-lg"
      >
        <PanelRight
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            expanded ? "rotate-180" : ""
          )}
        />
      </Button>

      <div className="mt-14 space-y-2">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg overflow-hidden transition-colors",
                location.pathname === item.path
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {expanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap font-medium tracking-tight"
                >
                  {item.name}
                </motion.span>
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20",
            !expanded && "px-0 justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {expanded && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
};

export default NavigationBar;
