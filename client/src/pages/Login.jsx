import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  // Helps us redirect to different pages
  const navigate = useNavigate();

  // Getting backend URL and login status setter from context
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  // Which form state we're in: "Sign Up" or "Login"
  const [state, setState] = useState("Sign Up");

  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // What happens when user submits the form
  const onSubmitHandler = async (e) => {
    e.preventDefault(); // prevent the page from refreshing
    axios.defaults.withCredentials = true; // allow cookies to be sent

    try {
      if (state === "Sign Up") {
        // Sending signup data to backend
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        // If signup is successful
        if (data.success) {
          setIsLoggedin(true);
          navigate("/"); // Go to homepage
        } else {
          toast.error(data.message); // Show error if backend says so
        }
      } else {
        // Sending login data to backend
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        // If login is successful
        if (data.success) {
          setIsLoggedin(true);
          navigate("/");
        } else {
          toast.error(data.message); // Show backend message if login failed
        }
      }
    } catch (error) {
      // Show proper error message if backend responds with an error
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      {/* App Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Login / Signup Card */}
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login into your account"}
        </p>

        {/* Form */}
        <form onSubmit={onSubmitHandler}>
          {/* Only show name input if signing up */}
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          {/* Email input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email ID"
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {/* Forgot password */}
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot password?
          </p>

          {/* Submit Button */}
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        {/* Switch between login and signup */}
        {state === "Sign Up" ? (
          <p
            onClick={() => setState("Login")}
            className="text-gray-400 text-center text-xs mt-4"
          >
            Already have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline">
              Login here
            </span>
          </p>
        ) : (
          <p
            onClick={() => setState("Sign Up")}
            className="text-gray-400 text-center text-xs mt-4"
          >
            Don't have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline">
              Sign-Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
