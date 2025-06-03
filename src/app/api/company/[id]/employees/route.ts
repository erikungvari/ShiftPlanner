import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET: Fetch all users in the company
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const companyId = params.id;
    try {
        const employees = await prisma.user.findMany({
            where: { companyId },
            select: { id: true, name: true, email: true }, // Exclude sensitive fields
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST: Add a user to the company
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const companyId = params.id;
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { companyId },
            select: { id: true, name: true, companyId: true },
        });

        return NextResponse.json({ message: 'User added to company', user });
    } catch (error) {
        console.error('Error adding user to company:', error);
        return NextResponse.json({ error: 'User not found or update failed' }, { status: 400 });
    }
}
