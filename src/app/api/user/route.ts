import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "922d966e88425a8e692762c95d1da273f75d707aa1b6204eea069282f8344d7f"; // Store securely

// ✅ GET: Fetch user data
export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    // Decode token
    const decoded = jwt.verify(token, SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, email: true, bio: true }, // Select only required fields
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json({ message: "Error fetching user data" }, { status: 500 });
  }
}

// ✅ PUT: Update user data
export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const { name, bio } = await req.json();

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { name, bio },
      select: { name: true, email: true, bio: true }, // Return updated fields
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/user error:", error);
    return NextResponse.json({ message: "Error updating user data" }, { status: 500 });
  }
}
