import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
async function main() {
  const activeLanguages = await prisma.language.findMany({
    where: { isActive: true },
    select: { code: true, isDefault: true },
  })

  let defaultLocale = null
  const locales = activeLanguages.map(i => {
    if (i.isDefault) {
      defaultLocale = i.code
    }
    return i.code
  })
  const targetPath = join(__dirname, '../../src/constants/locale/locales.json')
  writeFileSync(targetPath, JSON.stringify({
    defaultLocale,
    locales,
  }, null, 2))

  console.log(`✅ Generated locales.json with ${locales.length} locales`)
}

main().catch(e => {
    console.log(e)
    process.exit(1)
}).finally(() => prisma.$disconnect())