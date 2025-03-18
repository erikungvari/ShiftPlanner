import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Protect only dashboard pages
export const config = {
  matcher: '/dashboard/:path*',
};
