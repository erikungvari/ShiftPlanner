import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Format "04:00 - 05:00"
function formatHourRange(hour: number): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const from = `${pad(hour)}:00`;
    const to = `${pad((hour + 1) % 24)}:00`;
    return `${from} - ${to}`;
}

export async function GET() {
    try {
        console.log("Generating hour rows for 4 weeks...");

        // Clear table
        await prisma.hour.deleteMany({});

        const now = new Date();
        now.setMinutes(0, 0, 0); // start at top of current hour
        now.setHours(0); // start at midnight today

        const newHours = [];

        for (let week = 1; week <= 4; week++) {
            for (let day = 1; day <= 7; day++) {
                for (let hour = 0; hour < 24; hour++) {
                    // Calculate actual date
                    const date = new Date(now);
                    const daysToAdd = (week - 1) * 7 + (day - 1); // days since today
                    date.setDate(now.getDate() + daysToAdd);
                    date.setHours(hour);

                    newHours.push({
                        time: formatHourRange(hour),
                        day,
                        week,
                        date,
                    });
                }
            }
        }

        await prisma.hour.createMany({
            data: newHours,
            skipDuplicates: true,
        });

        console.log("Hour rows created with dates.");
        return NextResponse.json({ message: "Hour table populated with actual datetimes." });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
