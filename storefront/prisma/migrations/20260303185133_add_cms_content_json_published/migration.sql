-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CmsPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urlPath" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "contentJson" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CmsPage" ("content", "createdAt", "id", "title", "updatedAt", "urlPath") SELECT "content", "createdAt", "id", "title", "updatedAt", "urlPath" FROM "CmsPage";
DROP TABLE "CmsPage";
ALTER TABLE "new_CmsPage" RENAME TO "CmsPage";
CREATE UNIQUE INDEX "CmsPage_urlPath_key" ON "CmsPage"("urlPath");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
