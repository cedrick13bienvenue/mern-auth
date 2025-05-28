import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

// Changed from GET to POST for getUserData
userRouter.post("/data", userAuth, getUserData);

// Helper route to see all users (for testing - remove in production)
userRouter.get("/all", getAllUsers);

export default userRouter;
