import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

// POST route for getUserData (existing)
userRouter.post("/data", userAuth, getUserData);

// GET route for getUserData (new)
userRouter.get("/data", userAuth, getUserData);

/**
 * @swagger
 * /user/all:
 *   get:
 *     tags:
 *       - User
 *     description: Returns the homepage
 *     responses:
 *       200:
 *         description: hello world
 */
userRouter.get("/all", getAllUsers);

export default userRouter;
