import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const companyId = params.id;

  if (!companyId) {
    return NextResponse.json({ error: "Company ID is required." }, { status: 400 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        description: true,
        website: true,
        industry: true,
        bossId: true,
        users:true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const companyId = params.id;

  if (!companyId) {
    return NextResponse.json({ error: "Company ID is required." }, { status: 400 });
  }

  try {
    const body = await req.json();

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: body.name,
        description: body.description,
        website: body.website,
        industry: body.industry,
        bossId: body.bossId,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);

    if ((error as any).code === "P2025") {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}