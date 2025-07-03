import { AppEnvironment } from "@/environment/appEnvironment"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient()

if (AppEnvironment.MODE !== 'production') globalForPrisma.prisma = prisma

export default prisma