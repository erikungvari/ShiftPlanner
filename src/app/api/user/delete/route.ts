import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function DELETE(req: Request) {
  try {
    // Get auth token from cookies
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, SECRET) as { id: string };
    if (!decoded?.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Delete user from the database
    await prisma.user.delete({
      where: { id: decoded.id },
    });

    // Clear auth token cookie
    const response = NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
    response.cookies.set('auth_token', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
