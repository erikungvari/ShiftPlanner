import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate hour ranges like "4:00 - 5:00"
function formatHourRange(hour: number): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const from = `${pad(hour)}:00`;
    const to = `${pad((hour + 1) % 24)}:00`;
    return `${from} - ${to}`;
}

export async function GET() {
    try {
        console.log("Generating hour rows for 4 weeks...");

        // Step 1: Delete all existing Hour rows
        await prisma.hour.deleteMany({});

        const newHours = [];

        for (let week = 1; week <= 4; week++) {
            for (let day = 1; day <= 7; day++) {
                for (let hour = 0; hour < 24; hour++) {
                    newHours.push({
                        time: formatHourRange(hour),
                        day,
                        week,
                    });
                }
            }
        }

        // Step 2: Bulk insert new Hour rows
        await prisma.hour.createMany({
            data: newHours,
            skipDuplicates: true,
        });

        console.log("Successfully created 4 weeks of hour rows.");
        return NextResponse.json({ message: "Hour table reset and populated." });
    } catch (error) {
        console.error("Error creating hour rows:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
