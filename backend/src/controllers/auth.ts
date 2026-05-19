import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { cookieOptions, signAccessToken } from "../lib/jwt";
import { AuthRequest } from "../middleware/requireAuth";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at leat 8 characters" });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = signAccessToken({ userId: user.id, email: user.email });
    res.cookie("accessToken", token, cookieOptions);

    res.status(201).json({
      message: "Account created",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[REGISTER]", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: " All fields are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: "Invalid ccredentials" });
    }

    const token = signAccessToken({ userId: user.id, email: user.email });
    res.cookie("accessToken", token, cookieOptions);
    res.json({
      message: "Loggedin",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[LOGIN]", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
}

// Returns the currently authenticated user's data — used by the frontend on app load to restore the session automatically.
export async function me(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("[ME]", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
