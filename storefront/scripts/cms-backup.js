const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

(async () => {
  const rows = await prisma.cmsPage.findMany({
    select: { urlPath:true, title:true, published:true, updatedAt:true, contentJson:true, publishedContentJson:true },
    orderBy: { updatedAt: "desc" }
  });

  const outDir = path.join(process.cwd(), "scripts", "_cms_backup");
  fs.mkdirSync(outDir, { recursive: true });

  for (const r of rows) {
    const safe = r.urlPath === "/" ? "__root__" : r.urlPath.replaceAll("/", "__");
    const file = path.join(outDir, safe + ".json");
    fs.writeFileSync(file, JSON.stringify({
      urlPath: r.urlPath,
      title: r.title,
      published: r.published,
      updatedAt: r.updatedAt,
      contentJson: r.contentJson,
      publishedContentJson: r.publishedContentJson
    }, null, 2), "utf8");
    console.log("backup ->", file);
  }

  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
