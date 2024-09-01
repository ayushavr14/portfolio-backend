import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Make sure to load the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string; // You can use any type depending on your needs
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ msg: "authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Assumes "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: "Token is missing" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }; // Adjust the type if needed
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
