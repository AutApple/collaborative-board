/*
  Warnings:

  - Added the required column `boardId` to the `BoardElement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BoardElement" ADD COLUMN     "boardId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Board" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoardElement_boardId_idx" ON "BoardElement"("boardId");

-- AddForeignKey
ALTER TABLE "BoardElement" ADD CONSTRAINT "BoardElement_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
