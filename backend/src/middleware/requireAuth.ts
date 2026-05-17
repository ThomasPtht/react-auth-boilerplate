import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

// Middleware that protects routes by verifying the access token from the request cookie — blocks unauthenticated users with a 401.

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const paylod = verifyAccessToken(token);
    req.userId = paylod.userId;
    req.userEmail = paylod.email;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
