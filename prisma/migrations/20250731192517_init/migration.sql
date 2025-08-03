/*
  Warnings:

  - Added the required column `status` to the `Uptime` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Uptime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Uptime_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Uptime" ("id", "serviceId", "timestamp") SELECT "id", "serviceId", "timestamp" FROM "Uptime";
DROP TABLE "Uptime";
ALTER TABLE "new_Uptime" RENAME TO "Uptime";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
