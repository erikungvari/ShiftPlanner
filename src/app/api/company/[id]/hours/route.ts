// /api/company/[id]/hours/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const companyId = params.id;
    const { searchParams } = new URL(req.url);
    const weekStart = new Date(searchParams.get("weekStart")!);

    // Example: get all available hours for this company in that week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const entries = await prisma.hour.findMany({
        where: {
            companyId
        },
        select: {
            time: true
        }
    });

    return NextResponse.json({
        hours: entries.map(e => e.time.toString())
    });
}
