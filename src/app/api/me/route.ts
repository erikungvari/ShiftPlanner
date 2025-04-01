import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "922d966e88425a8e692762c95d1da273f75d707aa1b6204eea069282f8344d7f";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET);
    
    return NextResponse.json({ isLoggedIn: true, user: decoded });
  } catch (error) {
    console.error('LoggedIn verification failed', error)
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
