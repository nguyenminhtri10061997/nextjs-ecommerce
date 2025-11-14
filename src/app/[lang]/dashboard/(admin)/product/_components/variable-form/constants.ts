import { AttributeValue, Prisma } from "@prisma/client"

export type TAttAndAttValHash = {
  attHash: {
    [key: string]: Prisma.AttributeGetPayload<{
      include: {
        attributeValues: true
      }
    }>
  }
  attVHash: { [key: string]: AttributeValue }
}
