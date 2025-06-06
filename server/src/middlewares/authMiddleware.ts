import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token =
    (req.headers.refreshToken as string) || req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as {
      id: string;
    };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(403).json({ message: "Token failed", error: error });
    return;
  }
};
