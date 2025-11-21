import { useState, useEffect } from "react";
import { authService } from './../services/authService';
import { userService } from './../services/userService';

export function useAuth() {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));


  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      console.log(response);

      const newToken = response.data.token;

      localStorage.setItem("token", newToken);
      setToken(newToken);

      await fetchUserProfile(newToken);

      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };


  const fetchUserProfile = async (authToken) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profileData = await userService.getProfile();
      console.log("user prof", profileData);

      setUser({
        ...profileData,
        isLoggedIn: true
      });

      localStorage.setItem("user", JSON.stringify(profileData));
    } catch (error) {
      console.error("Lỗi khi tải Profile, có thể token hết hạn:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  return {
    login,
    logout,
    user,
    token,
    isLoading,
    isLoggedIn: !!user,
  };
}