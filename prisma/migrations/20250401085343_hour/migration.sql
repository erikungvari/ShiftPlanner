-- CreateTable
CREATE TABLE "Hour" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Hour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hour" ADD CONSTRAINT "Hour_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
