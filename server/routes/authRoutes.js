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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User registration info
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *             name:
 *               type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (validation error)
 */
authRouter.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user and obtain JWT token
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: User login credentials
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             token:
 *               type: string
 *       401:
 *         description: Unauthorized - invalid credentials
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user (clear token)
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
authRouter.post("/logout", logout);

/**
 * @swagger
 * /auth/send-verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send email verification OTP
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);

/**
 * @swagger
 * /auth/verify-account:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify user account with OTP
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: otp
 *         description: OTP code sent to user email
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - otp
 *           properties:
 *             otp:
 *               type: string
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid OTP or request
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/verify-account", userAuth, verifyEmail);

/**
 * @swagger
 * /auth/is-auth:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Check if user is authenticated
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/is-auth", userAuth, isAuthenticated);

/**
 * @swagger
 * /auth/send-reset-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send OTP for password reset
 *     parameters:
 *       - in: body
 *         name: email
 *         description: User email to send OTP
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *     responses:
 *       200:
 *         description: Reset OTP sent successfully
 *       400:
 *         description: Invalid email or request
 */
authRouter.post("/send-reset-otp", sendResetOtp);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password using OTP
 *     parameters:
 *       - in: body
 *         name: reset
 *         description: OTP and new password
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - otp
 *             - newPassword
 *           properties:
 *             otp:
 *               type: string
 *             newPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or password
 */
authRouter.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             message:
 *               type: string
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 verified:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/me", userAuth, getMe);

export default authRouter;
