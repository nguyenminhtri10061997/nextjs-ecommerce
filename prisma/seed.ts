import {
  EAttributeType,
  EPermissionAction,
  EPermissionResource,
  EUserOrAccountType,
  Prisma,
  PrismaClient,
} from "@prisma/client"

const prisma = new PrismaClient()

const permissions: Prisma.PermissionCreateManyInput[] = Object.values(
  EPermissionResource
).flatMap((rs) =>
  Object.values(EPermissionAction).map((ac) => ({
    resource: rs,
    action: ac,
  }))
)

const users: Prisma.UserCreateManyInput[] = [
  {
    id: "5a17166a-746f-42cf-90ce-8eb7db632b95",
    fullName: "admin",
    type: "STAFF",
  },
  {
    id: "5a17166a-746f-42cf-90ce-8eb7db632b96",
    fullName: "admin2",
    type: "STAFF",
  },
]

const roles: Prisma.RoleCreateManyInput[] = [
  {
    id: "33956ec7-b5db-4938-b978-75656e45d147",
    name: "admin",
  },
]
const rolePers: Prisma.RolePermissionCreateManyInput[] = [
  {
    
  },
]

const accounts: Prisma.AccountCreateManyInput[] = [
  {
    username: "admin",
    password: "$2b$10$a7W9rbM/qskWgrsq1yc9rulssXAp34ihmNAn.sk1pwTw1sfv1JlZ.",
    type: EUserOrAccountType.STAFF,
    userId: "5a17166a-746f-42cf-90ce-8eb7db632b95",
    roleId: "33956ec7-b5db-4938-b978-75656e45d147",
  },
  {
    username: "admin2",
    password: "$2b$10$a7W9rbM/qskWgrsq1yc9rulssXAp34ihmNAn.sk1pwTw1sfv1JlZ.",
    type: EUserOrAccountType.STAFF,
    userId: "5a17166a-746f-42cf-90ce-8eb7db632b96",
    roleId: "33956ec7-b5db-4938-b978-75656e45d147",
  },
]
const attributes: Prisma.AttributeCreateManyInput[] = [
  {
    id: "33956ec7-b5db-4938-b978-75656e45d148",
    name: "Size",
    type: EAttributeType.RADIO,
    slug: "size",
  },
]

const attributeValues: Prisma.AttributeValueCreateManyInput[] = [
  {
    name: "Small",
    attributeId: "33956ec7-b5db-4938-b978-75656e45d148",
  },
  {
    name: "Medium",
    attributeId: "33956ec7-b5db-4938-b978-75656e45d148",
  },
  {
    name: "Large",
    attributeId: "33956ec7-b5db-4938-b978-75656e45d148",
  },
  {
    name: "X-Large",
    attributeId: "33956ec7-b5db-4938-b978-75656e45d148",
  },
]

export async function main() {
  await Promise.all([
    prisma.permission.createMany({
      data: permissions,
      skipDuplicates: true,
    }),
    prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    }),
    prisma.role.createMany({
      data: roles,
      skipDuplicates: true,
    }),
    prisma.attribute.createMany({
      data: attributes,
    }),
  ])
  await Promise.all([
    prisma.account.createMany({
      data: accounts,
      skipDuplicates: true,
    }),
    prisma.attributeValue.createMany({
      data: attributeValues,
      skipDuplicates: true,
    }),
  ])
}

main().finally(() => prisma.$disconnect())
