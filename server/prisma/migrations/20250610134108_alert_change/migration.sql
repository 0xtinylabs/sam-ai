/*
  Warnings:

  - You are about to drop the column `type` on the `Alert` table. All the data in the column will be lost.
  - Added the required column `change_type` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticker` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "threshold" REAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "change_type" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "ticker" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Alert" ("id", "is_active", "keyword", "threshold", "token_address", "userId") SELECT "id", "is_active", "keyword", "threshold", "token_address", "userId" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
