import { useState } from "react";
import { authService } from "../services/authService";

export function useAuth() {
  const [isLoading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // const register = async (userData) => {
  //   setLoading(true);
  //   try {
  //     return await authService.register(userData);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const checkEmail = async (email) => {
  //   setLoading(true);
  //   try {
  //     console.log("Checking email:", email);

  //     const { exists } = await authService.checkEmail(email);
  //     return exists;
  //   } catch (error) {
  //     console.error("Check email failed:", error);
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.clear()
  };

  return { login,  isLoading, logout };
}
