import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log("Scheduled job started...");

        // Delete rows older than a week
        await prisma.hour.deleteMany({
            where: {
                createdAt: {
                    lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                },
            },
        });

        // Create a new row (modify as needed)
        // await prisma.hour.create({
        //     data: {
        //         name: "New Entry",
        //         createdAt: new Date(),
        //     },
        // });

        //for()

        console.log("Job completed successfully.");
        return NextResponse.json({ message: "Job executed successfully" });
    } catch (error) {
        console.error("Scheduled task error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
