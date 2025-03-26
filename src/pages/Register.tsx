
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { KeyRound, UserRound, Hash, Activity, ArrowLeft } from "lucide-react";

const Register = () => {
  const [key, setKey] = useState("");
  const [executions, setExecutions] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [hwid, setHwid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    
    setIsLoading(true);
    try {
      const newClient = await api.registerClient({
        key: key.trim(),
        executions: parseInt(executions) || 0,
        discord_id: parseInt(discordId) || 0,
        hwid: hwid.trim() || `hwid-${Date.now()}`
      });
      
      toast.success("Client registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register client");
    } finally {
      setIsLoading(false);
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
  
  const inputFields = [
    {
      id: "key",
      placeholder: "License Key",
      type: "text",
      value: key,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value),
      icon: <KeyRound className="h-4 w-4 text-muted-foreground" />,
      required: true
    },
    {
      id: "executions",
      placeholder: "Executions",
      type: "number",
      value: executions,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setExecutions(e.target.value),
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    },
    {
      id: "discordId",
      placeholder: "Discord ID",
      type: "number",
      value: discordId,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDiscordId(e.target.value),
      icon: <UserRound className="h-4 w-4 text-muted-foreground" />
    },
    {
      id: "hwid",
      placeholder: "HWID",
      type: "text",
      value: hwid,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setHwid(e.target.value),
      icon: <Hash className="h-4 w-4 text-muted-foreground" />
    }
  ];
  
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
        <Card className="glass-morphism border-white/5">
          <CardHeader className="space-y-1">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold tracking-tight text-gradient">
                lurk.cc Register
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-muted-foreground">
                Development tool for client registration
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form 
              onSubmit={handleRegister}
              className="space-y-4"
              variants={containerVariants}
            >
              {inputFields.map((field, index) => (
                <motion.div 
                  key={field.id}
                  className="space-y-2"
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      type={field.type}
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-black/20 border-white/10 focus-visible:ring-white/20 pl-10"
                      required={field.required}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {field.icon}
                    </span>
                  </div>
                </motion.div>
              ))}
              
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
                        Registering...
                      </>
                    ) : (
                      "Register Client"
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
          <CardFooter>
            <motion.div variants={itemVariants} className="w-full">
              <Link to="/login" className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full text-primary/70 hover:text-primary bg-white/5 hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
