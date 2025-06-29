import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

/**
 * @swagger
 * /user/data:
 *   get:
 *     tags:
 *       - User
 *     summary: Get authenticated user's data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: object
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/data", userAuth, getUserData);

/**
 * @swagger
 * /user/data:
 *   post:
 *     tags:
 *       - User
 *     summary: Post user data (if applicable)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: userData
 *         description: User data to post
 *         required: true
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: User data posted successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.post("/data", userAuth, getUserData);

/**
 * @swagger
 * /user/all:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (public or admin-only depending on your implementation)
 *     responses:
 *       200:
 *         description: List of all users
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *       401:
 *         description: Unauthorized (if applicable)
 */
userRouter.get("/all", getAllUsers);

export default userRouter;
