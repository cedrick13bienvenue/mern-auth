import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login Again",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      // Attach user info to req.user instead of modifying req.body
      req.user = { id: decoded.id };
      // Also add userId directly to req for backward compatibility
      req.userId = decoded.id;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};

export default userAuth;
