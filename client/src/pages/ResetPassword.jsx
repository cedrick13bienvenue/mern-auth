import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("").slice(0, 6);

    const newOtp = [...otp];
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index] && /^\d$/.test(char)) {
        inputRefs.current[index].value = char;
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
  };

  // Submit Email for Reset
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending email to:", email);
      console.log("Backend URL:", backendUrl);

      const response = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        {
          email,
        }
      );

      console.log("Response:", response.data);

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Reset email sent successfully!");
        setIsEmailSent(true);
      } else {
        toast.error(data.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Full error:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error("Failed to send request");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit OTP for Verification
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/auth/verify-reset-otp",
        {
          email,
          otp: otpString,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "OTP verified successfully!");
        setIsOtpSubmitted(true);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "OTP verification failed");
      } else {
        toast.error("Failed to verify OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit New Password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/auth/reset-password",
        {
          email,
          otp: otp.join(""),
          newPassword,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Password reset failed");
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const ArrayOTP = inputRefs.current.map((e) => e.value);
    const newOtp = [...otp];
    ArrayOTP.forEach((value, index) => {
      newOtp[index] = value;
    });
    setOtp(newOtp);

    const otpString = ArrayOTP.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/auth/verify-reset-otp",
        {
          email,
          otp: otpString,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "OTP verified successfully!");
        setIsOtpSubmitted(true);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "OTP verification failed");
      } else {
        toast.error("Failed to verify OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Email Input Form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Email ID"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </form>
      )}

      {/* OTP Input Form */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email ID
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={isLoading}
                  value={otp[index]}
                />
              ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="text-center mt-4 text-indigo-300 text-xs">
            Didn't receive code?
            <button
              type="button"
              onClick={() => setIsEmailSent(false)}
              className="text-indigo-400 hover:text-indigo-300 ml-1"
            >
              Resend
            </button>
          </p>
        </form>
      )}

      {/* New Password Form */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength="6"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
