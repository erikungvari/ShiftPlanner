import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatHourRange(hour: number): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const from = `${pad(hour)}:00`;
    const to = `${pad((hour + 1) % 24)}:00`;
    return `${from} - ${to}`;
}

export async function POST(req: Request) {
    try {
        const origin = req.headers.get("origin") || "http://localhost:3000"; // fallback for dev
        const userResponse = await fetch(`${origin}/api/user`, {
            headers: {
                cookie: req.headers.get("cookie") || "",
            },
        });

        if (!userResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch user" }, { status: userResponse.status });
        }

        const user = await userResponse.json();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const company = await prisma.company.findFirst({
            where: {
                bossId: user.id,
            },
        });

        if (!company) {
            return NextResponse.json({ error: "You are not a company owner." }, { status: 403 });
        }

        await prisma.hour.deleteMany({
            where: {
                companyId: company.id,
            },
        });

        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start today at midnight

        const newHours = [];

        for (let week = 1; week <= 4; week++) {
            for (let day = 0; day < 7; day++) {
                for (let hour = 0; hour < 24; hour++) {
                    const date = new Date(now);
                    const daysToAdd = (week - 1) * 7 + day;
                    date.setDate(now.getDate() + daysToAdd);
                    date.setHours(hour);

                    newHours.push({
                        time: formatHourRange(hour),
                        day: ((date.getDay() + 6) % 7) + 1, // Sunday=0 -> 7
                        week,
                        date,
                        companyId: company.id,
                    });
                }
            }
        }

        await prisma.hour.createMany({
            data: newHours,
            skipDuplicates: true,
        });

        return NextResponse.json({ message: "Hours generated successfully." });
    } catch (error) {
        console.error("Error generating hours:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}