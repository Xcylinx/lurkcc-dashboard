
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-black/70 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-morphism">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-gradient">
              Register Client
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Development tool for client registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="key"
                  placeholder="License Key"
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-white/20"
                  required
                />
                <Input
                  id="executions"
                  placeholder="Executions"
                  type="number"
                  value={executions}
                  onChange={(e) => setExecutions(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-white/20"
                />
                <Input
                  id="discordId"
                  placeholder="Discord ID"
                  type="number"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-white/20"
                />
                <Input
                  id="hwid"
                  placeholder="HWID"
                  type="text"
                  value={hwid}
                  onChange={(e) => setHwid(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-white/20"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register Client"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Link to="/login" className="w-full">
              <Button variant="link" className="w-full text-primary/70 hover:text-primary">
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
