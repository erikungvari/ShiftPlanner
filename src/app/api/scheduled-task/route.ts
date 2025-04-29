import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatHourRange(hour: number): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const from = `${pad(hour)}:00`;
    const to = `${pad((hour + 1) % 24)}:00`;
    return `${from} - ${to}`;
}

export async function GET() {
    try {
        console.log("Starting company-specific weekly hour update...");

        const now = new Date();

        // Step 1: Delete past hours
        await prisma.hour.deleteMany({
            where: {
                date: { lt: now },
            },
        });

        // Step 2: Shift existing weeks
        await prisma.hour.updateMany({ where: { week: 2 }, data: { week: 1 } });
        await prisma.hour.updateMany({ where: { week: 3 }, data: { week: 2 } });
        await prisma.hour.updateMany({ where: { week: 4 }, data: { week: 3 } });

        // Step 3: Get all companies
        const companies = await prisma.company.findMany();

        // Step 4: For each company, find their latest Hour date
        for (const company of companies) {
            const latestHour = await prisma.hour.findFirst({
                where: { companyId: company.id },
                orderBy: { date: "desc" },
            });

            if (!latestHour) {
                console.warn(`No existing hour rows found for company ${company.name}`);
                continue;
            }

            const startDate = new Date(latestHour.date);
            startDate.setHours(0, 0, 0, 0);
            startDate.setDate(startDate.getDate() + 1); // next day after latest

            const newHours = [];

            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                for (let hour = 0; hour < 24; hour++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + dayOffset);
                    date.setHours(hour);

                    newHours.push({
                        time: formatHourRange(hour),
                        day: ((date.getDay() + 6) % 7) + 1, // convert JS Sunday=0 to 1–7
                        week: 4,
                        date,
                        companyId: company.id,
                    });
                }
            }

            await prisma.hour.createMany({
                data: newHours,
                skipDuplicates: true,
            });

            console.log(`Created new week 4 hours for company: ${company.name}`);
        }

        return NextResponse.json({ message: "Weekly hours updated per company." });
    } catch (error) {
        console.error("Error updating hour rows:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
