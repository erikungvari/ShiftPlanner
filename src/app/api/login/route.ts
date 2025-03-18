import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Set this in .env

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });

    (await cookies()).set('auth_token', token, { httpOnly: true, secure: true, maxAge: 604800 });

    return NextResponse.json({ message: 'Login successful.' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
