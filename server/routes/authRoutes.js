import express from "express";
import {
  getMe,
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     description: Login
 *     parameters:
 *       - name: body
 *         description: User fields
 *         in: body
 *         schema:
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - password
 *             - email
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// Protected routes (require authentication)
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - auth
 *     description: Returns the homepage
 *     security:
 *       - bearerAuth: -[]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
authRouter.get("/me", userAuth, getMe);

export default authRouter;
