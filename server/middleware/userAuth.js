import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authotized Login Again" });
  }

  try {
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
