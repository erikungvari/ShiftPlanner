import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

export async function POST(req: Request) {
  try {
    const { companyName, industry, website, description } = await req.json();

    if (!companyName || !industry) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Get and verify JWT
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const userId = decoded.id;

    // Create the company
    const company = await prisma.company.create({
      data: {
        name: companyName,
        industry,
        website,
        description,
        bossId: userId,
      },
    });

    // Link the user to the company
    await prisma.user.update({
      where: { id: userId },
      data: { companyId: company.id },
    });

    return NextResponse.json({ message: 'Company registered and linked to user!', company }, { status: 201 });

  } catch (error) {
    console.error('Error creating company and linking user:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
