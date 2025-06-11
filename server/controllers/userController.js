import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // Change this line - use req.userId instead of req.body.userId
    const userId = req.userId; // This comes from your userAuth middleware

    // Add validation
    if (!userId) {
      return res.json({ success: false, message: "UserId is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Helper route to get all users (for testing purposes)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find(
      {},
      { name: 1, email: 1, isAccountVerified: 1 }
    );
    res.json({
      success: true,
      users: users,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};