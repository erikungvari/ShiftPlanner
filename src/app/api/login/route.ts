import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || '922d966e88425a8e692762c95d1da273f75d707aa1b6204eea069282f8344d7f';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Find user in the database
    const user = await prisma.user.findUnique({ where: { email } });

    // Validate user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });

    // ✅ Correct way to set cookie in Next.js API
    const response = NextResponse.json({ message: 'Login successful.' }, { status: 200 });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
