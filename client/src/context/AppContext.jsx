import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async ()=>{
    try {
      
    } catch (error) {
      
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
      // Fix: Use 'error' instead of 'data' in catch block
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      console.error("getUserData error:", error);
    }
  };



  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};