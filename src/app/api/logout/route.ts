import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully." });

  response.cookies.set({
    name: "auth_token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
