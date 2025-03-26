
import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LogIn, Key } from "lucide-react";

const Login = () => {
  const [key, setKey] = useState("");
  const { login, isLoading } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      await login(key.trim());
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-black/70 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/5 backdrop-blur-3xl"
            style={{
              width: `${Math.random() * 600 + 200}px`,
              height: `${Math.random() * 600 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
              ],
              y: [
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
              ],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <Card className="glass-morphism border-white/5">
          <CardHeader className="space-y-1">
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <motion.div
                className="h-16 w-16 rounded-full glass-morphism flex items-center justify-center"
                animate={{
                  boxShadow: ["0 0 0px rgba(139, 92, 246, 0.3)", "0 0 20px rgba(139, 92, 246, 0.5)", "0 0 0px rgba(139, 92, 246, 0.3)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Key className="h-8 w-8 text-purple-400" />
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold tracking-tight text-gradient text-center">
                lurk.cc
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-muted-foreground text-center">
                Enter your license key to access your dashboard
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form 
              onSubmit={handleLogin}
              className="space-y-4"
              variants={itemVariants}
            >
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <div className="relative">
                  <Input
                    id="key"
                    placeholder="License Key"
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="bg-black/20 border-white/10 focus-visible:ring-white/20 pl-10"
                    autoComplete="off"
                    required
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-white/10 hover:bg-white/20 text-white group relative overflow-hidden"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <motion.div
                          className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.p 
              className="text-sm text-muted-foreground"
              variants={itemVariants}
            >
              Development options:
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link to="/register">
                <Button variant="link" className="text-sm text-primary/70 hover:text-primary">
                  Register
                </Button>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
