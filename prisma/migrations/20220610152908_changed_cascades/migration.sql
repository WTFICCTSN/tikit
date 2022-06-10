-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Ticket_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_priority_fkey" FOREIGN KEY ("id_priority") REFERENCES "PriorityType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_machine_fkey" FOREIGN KEY ("id_machine") REFERENCES "Machine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ticket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("createdAt", "desc", "id", "id_machine", "id_priority", "id_tech", "id_ticket", "id_user", "title", "updatedAt") SELECT "createdAt", "desc", "id", "id_machine", "id_priority", "id_tech", "id_ticket", "id_user", "title", "updatedAt" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_title_key" ON "Ticket"("title");
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_pic" TEXT,
    CONSTRAINT "Profile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Profile_id_pic_fkey" FOREIGN KEY ("id_pic") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("first_name", "id", "id_pic", "id_user", "last_name") SELECT "first_name", "id", "id_pic", "id_user", "last_name" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_id_user_key" ON "Profile"("id_user");
CREATE UNIQUE INDEX "Profile_id_pic_key" ON "Profile"("id_pic");
CREATE TABLE "new_ContactsOnProfile" (
    "id_contact" TEXT NOT NULL,
    "id_profile" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("id_contact", "id_profile"),
    CONSTRAINT "ContactsOnProfile_id_contact_fkey" FOREIGN KEY ("id_contact") REFERENCES "Contact" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContactsOnProfile_id_profile_fkey" FOREIGN KEY ("id_profile") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ContactsOnProfile" ("assignedAt", "assignedBy", "id_contact", "id_profile") SELECT "assignedAt", "assignedBy", "id_contact", "id_profile" FROM "ContactsOnProfile";
DROP TABLE "ContactsOnProfile";
ALTER TABLE "new_ContactsOnProfile" RENAME TO "ContactsOnProfile";
CREATE TABLE "new_ImageFromTicket" (
    "id_ticket" INTEGER NOT NULL,
    "id_imagem" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("id_ticket", "id_imagem"),
    CONSTRAINT "ImageFromTicket_id_imagem_fkey" FOREIGN KEY ("id_imagem") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ImageFromTicket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "Ticket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImageFromTicket" ("assignedAt", "assignedBy", "id_imagem", "id_ticket") SELECT "assignedAt", "assignedBy", "id_imagem", "id_ticket" FROM "ImageFromTicket";
DROP TABLE "ImageFromTicket";
ALTER TABLE "new_ImageFromTicket" RENAME TO "ImageFromTicket";
CREATE TABLE "new_Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "profileId" TEXT,
    CONSTRAINT "Machine_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Machine_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Machine" ("createdAt", "id", "id_user", "name", "profileId", "updatedAt") SELECT "createdAt", "id", "id_user", "name", "profileId", "updatedAt" FROM "Machine";
DROP TABLE "Machine";
ALTER TABLE "new_Machine" RENAME TO "Machine";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
