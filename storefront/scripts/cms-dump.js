const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const rows = await prisma.cmsPage.findMany({
    select: { urlPath:true, title:true, published:true, updatedAt:true, contentJson:true, publishedContentJson:true },
    orderBy: { updatedAt: "desc" }
  });

  console.log("TOTAL:", rows.length);
  for (const r of rows) {
    const dj = r.contentJson ? r.contentJson.length : 0;
    const pj = r.publishedContentJson ? r.publishedContentJson.length : 0;
    console.log(
      String(r.urlPath) +
        " | pub=" + String(r.published) +
        " | draftLen=" + dj +
        " | pubLen=" + pj +
        " | updated=" + r.updatedAt.toISOString() +
        " | title=" + String(r.title || "")
    );
  }

  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
