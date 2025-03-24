import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET);
    
    return NextResponse.json({ isLoggedIn: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
