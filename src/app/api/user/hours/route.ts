import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('auth_token')?.value;
        if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

        const decoded = jwt.verify(token, SECRET) as { id: string };
        const { hours } = await req.json();

        if (!Array.isArray(hours)) {
            return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
        }

        // Remove existing user hours in that week
        const weekStart = new Date(hours[0]);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('POST /api/user/hours error:', error);
        return NextResponse.json({ message: 'Error saving hours' }, { status: 500 });
    }
}
