-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "protectedMode" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_RoomEditor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_RoomEditor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoomEditor_B_index" ON "_RoomEditor"("B");

-- AddForeignKey
ALTER TABLE "_RoomEditor" ADD CONSTRAINT "_RoomEditor_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomEditor" ADD CONSTRAINT "_RoomEditor_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
