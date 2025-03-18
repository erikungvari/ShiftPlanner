import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { nickname, email, password } = await req.json();

    if (!nickname || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in the database
    const user = await prisma.user.create({
      data: {
        nickname,
        email,
        password: hashedPassword, // Store hashed password
      },
    });

    return NextResponse.json({ message: 'User registered successfully!', user }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
