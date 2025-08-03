/*
  Warnings:

  - Added the required column `name` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "service_url" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "icon_url" TEXT NOT NULL
);
INSERT INTO "new_Service" ("icon_url", "id", "port", "service_url") SELECT "icon_url", "id", "port", "service_url" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
