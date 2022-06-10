/*
  Warnings:

  - You are about to drop the `Component` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ComponentOnSpec` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MachineType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Specification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `factory_id` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `id_type` on the `Machine` table. All the data in the column will be lost.
  - The primary key for the `ImageFromTicket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_ticket` on the `ImageFromTicket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id_ticket` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `id_user` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_priority` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MachineType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Component";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ComponentOnSpec";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MachineType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Specification";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PriorityType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "id_userType" TEXT,
    CONSTRAINT "User_id_userType_fkey" FOREIGN KEY ("id_userType") REFERENCES "UserType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "id_userType", "updatedAt") SELECT "createdAt", "email", "id", "id_userType", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "profileId" TEXT,
    CONSTRAINT "Machine_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Machine_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Machine" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Machine";
DROP TABLE "Machine";
ALTER TABLE "new_Machine" RENAME TO "Machine";
CREATE TABLE "new_ImageFromTicket" (
    "id_ticket" INTEGER NOT NULL,
    "id_imagem" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("id_ticket", "id_imagem"),
    CONSTRAINT "ImageFromTicket_id_imagem_fkey" FOREIGN KEY ("id_imagem") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ImageFromTicket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ImageFromTicket" ("assignedAt", "assignedBy", "id_imagem", "id_ticket") SELECT "assignedAt", "assignedBy", "id_imagem", "id_ticket" FROM "ImageFromTicket";
DROP TABLE "ImageFromTicket";
ALTER TABLE "new_ImageFromTicket" RENAME TO "ImageFromTicket";
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_pic" TEXT,
    CONSTRAINT "Profile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Profile_id_pic_fkey" FOREIGN KEY ("id_pic") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("first_name", "id", "id_pic", "id_user", "last_name") SELECT "first_name", "id", "id_pic", "id_user", "last_name" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_id_user_key" ON "Profile"("id_user");
CREATE UNIQUE INDEX "Profile_id_pic_key" ON "Profile"("id_pic");
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "id_ticket" INTEGER,
    "id_tech" TEXT,
    "id_user" TEXT NOT NULL,
    "id_priority" INTEGER NOT NULL,
    "id_machine" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ticket_id_tech_fkey" FOREIGN KEY ("id_tech") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_priority_fkey" FOREIGN KEY ("id_priority") REFERENCES "PriorityType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_machine_fkey" FOREIGN KEY ("id_machine") REFERENCES "Machine" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("id", "id_machine", "id_ticket") SELECT "id", "id_machine", "id_ticket" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_title_key" ON "Ticket"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "PriorityType_name_key" ON "PriorityType"("name");
