import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api"; // Import the API client

// Update the AuthContextType interface to include register
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

// Add RegisterData interface
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
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

    // For the demo, we'll create supplier account
    if (!storedUser) {
      const supplierUser = {
        id: 2,
        username: "isaac@addy",
        password: "Zavi1255@",
        email: "isaac@addy",
        name: "Isaac Addy",
        role: "supplier",
        createdAt: new Date().toISOString()
      };
      
      // Register the supplier
      api.users.create(supplierUser).catch(err => {
        console.error("Failed to create supplier account:", err);
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call your API to authenticate the user
      const response = await api.auth.login(email, password);
      
      // Set the user in state and localStorage
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    // Remove user from state and localStorage
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const register = async (userData: RegisterData) => {
    try {
      // Call your API to register the user
      const response = await api.auth.register(userData);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
