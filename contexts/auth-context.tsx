import { router } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface User {
  token?: string;
  _id: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      console.log(username, password);
      const res = await fetch("http://192.168.1.138:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log(res);
      const data = await res.json();
      console.log(data);
      if (data?.token) {
        // You might want to handle setting the user here, e.g. setUser(data.user);
        setUser(data);

        router.push("/(main)/(tabs)/Home");
        return;
      }

      throw new Error("Wrong username or password")
    } catch (error) {
      alert(
        "Login failed:" + `${JSON.stringify("Wrong username or password")}`
      );
      // Optionally handle error state here
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch("http://192.168.1.138:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      // Optionally set user after registration, e.g. setUser(data.user);

      router.push("/login");
      console.log(user);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed:" + `${JSON.stringify(error)}`);
      // Optionally handle error state here
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
