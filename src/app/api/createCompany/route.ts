import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { companyName, industry, website, description } = await req.json();
    const bossId = "1";

    if (!companyName || !industry) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name:companyName,
        industry,
        website,
        description,
        bossId
      },
    });

    return NextResponse.json({ message: 'Company registered successfully!', company }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
