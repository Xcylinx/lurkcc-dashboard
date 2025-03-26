
import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const Login = () => {
  const [key, setKey] = useState("");
  const { login, isLoading } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      await login(key.trim());
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
              lurk.cc
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your license key to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              </div>
              <Button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Development options:
            </p>
            <Link to="/register">
              <Button variant="link" className="text-sm text-primary/70 hover:text-primary">
                Register
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
