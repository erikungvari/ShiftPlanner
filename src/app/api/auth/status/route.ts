import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET() {
    const token = (await cookies()).get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        jwt.verify(token, SECRET);
        return NextResponse.json({ authenticated: true });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
