
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, Client } from "../types";
import { api } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check for saved auth token in localStorage
    const savedKey = localStorage.getItem("auth_key");
    
    if (savedKey) {
      setIsLoading(true);
      api.authenticate(savedKey)
        .then(result => {
          if (result) {
            setClient(result);
            // We'll let the routes handle the navigation based on isAuthenticated
          } else {
            // Invalid saved key
            localStorage.removeItem("auth_key");
            navigate("/login");
          }
        })
        .catch(error => {
          console.error("Authentication error:", error);
          toast.error("Authentication failed");
          localStorage.removeItem("auth_key");
          navigate("/login");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);
  
  const login = async (key: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await api.authenticate(key);
      if (result) {
        setClient(result);
        localStorage.setItem("auth_key", key);
        toast.success("Successfully logged in");
        
        // Instead of hardcoding the navigation to dashboard,
        // use the location state to determine where to redirect
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from);
        
        return true;
      } else {
        toast.error("Invalid license key");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setClient(null);
    localStorage.removeItem("auth_key");
    toast.info("Logged out");
    navigate("/login");
  };
  
  return (
    <AuthContext.Provider value={{ client, isAuthenticated: !!client, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
