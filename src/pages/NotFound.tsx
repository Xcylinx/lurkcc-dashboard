
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/80 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md mx-auto px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto rounded-full bg-red-500/10 p-3 w-16 h-16 flex items-center justify-center"
        >
          <AlertCircle className="h-8 w-8 text-red-500" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gradient">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button asChild className="relative overflow-hidden group">
            <Link to="/dashboard">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Home className="mr-2 h-4 w-4" /> 
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
