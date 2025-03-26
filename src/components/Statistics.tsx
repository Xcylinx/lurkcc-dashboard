
import { StatisticsProps } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const Statistics = ({ recentExecutions, totalExecutions }: StatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <Card className="glass-morphism overflow-hidden border-white/5 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg group-hover:text-gradient transition-all duration-300">Recent Executions</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <motion.span 
                className="text-4xl font-bold text-gradient"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  delay: 0.2
                }}
              >
                {recentExecutions}
              </motion.span>
              <span className="ml-2 text-muted-foreground text-sm">executions</span>
            </div>
            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" 
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min(100, (recentExecutions / (totalExecutions || 1)) * 100)}%` 
                }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <Card className="glass-morphism overflow-hidden border-white/5 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg group-hover:text-gradient transition-all duration-300">Total Executions</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <motion.span 
                className="text-4xl font-bold text-gradient"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  delay: 0.3
                }}
              >
                {totalExecutions}
              </motion.span>
              <span className="ml-2 text-muted-foreground text-sm">executions</span>
            </div>
            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Statistics;
