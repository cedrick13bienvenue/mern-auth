import React from "react";
import { assets } from "../assets/assets";

const ResetPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <h1>Reseting Password</h1>
    </div>
  );
};

export default ResetPassword;
