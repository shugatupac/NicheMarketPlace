import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }

    // For the demo, we'll auto-login as a customer
    if (!storedUser) {
      const demoUser = {
        id: 1,
        username: "customer1",
        email: "customer1@example.com",
        name: "Kofi Anan",
        role: "buyer",
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(demoUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        username,
        password
      });
      
      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        ...userData,
        role: userData.role || "buyer" // Default to buyer if role not specified
      });
      
      const newUser = await response.json();
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Shea Ghana, ${newUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
