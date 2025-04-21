import { apiRequest } from "./queryClient";
import type { User } from "./types";

export const api = {
  users: {
    create: async (userData: Partial<User>) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    getById: async (id: number) => {
      const response = await apiRequest("GET", `/api/users/${id}`);
      return response.json();
    },
    update: async (id: number, userData: Partial<User>) => {
      const response = await apiRequest("PUT", `/api/users/${id}`, userData);
      return response.json();
    },
    delete: async (id: number) => {
      await apiRequest("DELETE", `/api/users/${id}`);
      return true;
    }
  },
  auth: {
    login: async (username: string, password: string) => {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      return response.json();
    },
    register: async (userData: any) => {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return response.json();
    },
    logout: async () => {
      await apiRequest("POST", "/api/auth/logout");
      return true;
    }
  }
};