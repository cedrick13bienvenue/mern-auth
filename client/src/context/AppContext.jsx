import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // If no token, user is not logged in
        setIsLoggedin(false);
        return;
      }

      // Include the token in the request headers
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      } else {
        setIsLoggedin(false);
      }
      
    } catch (error) {
      setIsLoggedin(false);
      // Only show error toast if it's not just a missing/invalid token
      if (error.response?.status !== 401) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  }

  const getUserData = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("No authentication token found. Please login again.");
        return;
      }

      // Add authorization header with the token
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      console.error("getUserData error:", error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState, // Export this so you can call it after login
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};