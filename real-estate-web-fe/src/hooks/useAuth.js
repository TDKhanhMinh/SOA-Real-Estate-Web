import { useState } from "react";
import { authService } from "../services/authService";

export function useAuth() {
  const [isLoading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.clear()
  };

  return { login, isLoading, logout };
}
