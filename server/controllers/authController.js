import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  try {
    console.log("Register request received");
    console.log("Request body:", req.body);
    console.log("Request headers content-type:", req.headers["content-type"]);

    // Check if req.body exists and is an object
    if (!req.body || typeof req.body !== "object") {
      console.log("Invalid request body detected");
      return res.status(400).json({
        success: false,
        message:
          "Invalid request body. Please send JSON data with Content-Type: application/json",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing required fields");
      return res.json({ success: false, message: "Missing Details" });
    }

    console.log("Checking for existing user");
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating new user");
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `🎉 You're in, ${name}! Welcome aboard.`,
      text: `Hi ${name},

Thank you for signing up! Your account has been created successfully.

If you did not create this account, please ignore this message or contact support.

Best regards,  
The Team`,
    };

    console.log("Sending welcome email");
    await transporter.sendMail(mailOptions);

    console.log("Registration successful");
    res.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // Add debugging and better error handling
    console.log("Login request received");
    console.log("Request body:", req.body);
    console.log("Request headers content-type:", req.headers["content-type"]);

    // Check if req.body exists and is an object
    if (!req.body || typeof req.body !== "object") {
      console.log("Invalid request body detected");
      return res.status(400).json({
        success: false,
        message:
          "Invalid request body. Please send JSON data with Content-Type: application/json",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("Attempting to find user with email:", email);
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("User found, comparing passwords");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password does not match");
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("Password matches, generating token");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    console.log("Login successful");
    return res.json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    // Get userId from the middleware (attached to req.user)
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not found. Please log in again.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.\n\nBest regards,`,
    };

    await transporter.sendMail(mailOption);

    res.json({
      success: true,
      message: "Verification OTP sent to your email.",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  // Get userId from the middleware
  const userId = req.user?.id || req.userId;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // Get userId from the middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found. Please log in again.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
