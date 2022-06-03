/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "phone" BOOLEAN NOT NULL,
    "email" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_pic" TEXT NOT NULL,
    CONSTRAINT "Profile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Profile_id_pic_fkey" FOREIGN KEY ("id_pic") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactsOnProfile" (
    "id_contact" TEXT NOT NULL,
    "id_profile" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("id_contact", "id_profile"),
    CONSTRAINT "ContactsOnProfile_id_contact_fkey" FOREIGN KEY ("id_contact") REFERENCES "Contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContactsOnProfile_id_profile_fkey" FOREIGN KEY ("id_profile") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MachineType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "id_machine" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_ticket" TEXT NOT NULL,
    "id_machine" TEXT,
    CONSTRAINT "Ticket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_machine_fkey" FOREIGN KEY ("id_machine") REFERENCES "Machine" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImageFromTicket" (
    "id_ticket" TEXT NOT NULL,
    "id_imagem" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("id_ticket", "id_imagem"),
    CONSTRAINT "ImageFromTicket_id_imagem_fkey" FOREIGN KEY ("id_imagem") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ImageFromTicket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Specification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT true,
    "id_machine" TEXT NOT NULL,
    CONSTRAINT "Specification_id_machine_fkey" FOREIGN KEY ("id_machine") REFERENCES "Machine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ComponentOnSpec" (
    "id_spec" TEXT NOT NULL,
    "id_comp" TEXT NOT NULL,
    "partSerial" TEXT,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("id_spec", "id_comp"),
    CONSTRAINT "ComponentOnSpec_id_comp_fkey" FOREIGN KEY ("id_comp") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ComponentOnSpec_id_spec_fkey" FOREIGN KEY ("id_spec") REFERENCES "Specification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "factory_id" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Machine_id_type_fkey" FOREIGN KEY ("id_type") REFERENCES "MachineType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "id_userType" TEXT NOT NULL,
    CONSTRAINT "User_id_userType_fkey" FOREIGN KEY ("id_userType") REFERENCES "UserType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "updatedAt") SELECT "createdAt", "email", "id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "UserType_name_key" ON "UserType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_info_key" ON "Contact"("info");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_user_key" ON "Profile"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_pic_key" ON "Profile"("id_pic");

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");

-- CreateIndex
CREATE UNIQUE INDEX "MachineType_name_key" ON "MachineType"("name");
