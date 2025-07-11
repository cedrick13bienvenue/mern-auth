import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {}, // Empty body since this is likely just triggering OTP send
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification OTP"
      );
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Include token in logout request if available
        await axios.post(
          backendUrl + "/api/auth/logout",
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Clear local storage and state regardless of API response
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setUserData(false);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      // Even if logout API fails, clear local state
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setUserData(false);
      navigate("/");
      toast.error(
        error?.response?.data?.message || "Logout completed with errors"
      );
    }
  };
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex itmes-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover: bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
