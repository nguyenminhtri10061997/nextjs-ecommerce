import {
  EAttributeType,
  EPermissionAction,
  EPermissionResource,
  EUserOrAccountType,
  Prisma,
  PrismaClient,
} from "@prisma/client"

const prisma = new PrismaClient()
export async function main() {
  const [permissionsInDb] = await Promise.all([
    prisma.permission.findMany({
      include: {
        role: true,
      },
    }),
  ])

  const permissionsInDbHash = Object.fromEntries(
    permissionsInDb.map((per) => [`${per.resource}_${per.action}`, per])
  )

  const newPermission: Prisma.PermissionCreateManyInput[] = []

  Object.values(EPermissionResource).forEach((rs) =>
    Object.values(EPermissionAction).forEach((ac) => {
      const perInDb = permissionsInDbHash[`${rs}_${ac}`]
      if (!perInDb) {
        newPermission.push({
          resource: rs,
          action: ac,
        })
      }
    })
  )

  const allPer: Prisma.PermissionCreateManyInput[] = permissionsInDb
    .map((i) => ({
      resource: i.resource,
      action: i.action,
    }))
    .concat(newPermission)

  const userAdminId = "5a17166a-746f-42cf-90ce-8eb7db632b95"
  const userAdmin2Id = "5a17166a-746f-42cf-90ce-8eb7db632b96"

  const users: Prisma.UserCreateManyInput[] = [
    {
      id: userAdminId,
      fullName: "admin",
      type: "STAFF",
    },
    {
      id: userAdmin2Id,
      fullName: "admin2",
      type: "STAFF",
    },
  ]

  const attributeRadioId = "33956ec7-b5db-4938-b978-75656e45d148"

  const attributes: Prisma.AttributeCreateManyInput[] = [
    {
      id: attributeRadioId,
      name: "Size",
      type: EAttributeType.RADIO,
      slug: "size",
    },
  ]

  const attributeValues: Prisma.AttributeValueCreateManyInput[] = [
    {
      name: "Small",
      attributeId: attributeRadioId,
    },
    {
      name: "Medium",
      attributeId: attributeRadioId,
    },
    {
      name: "Large",
      attributeId: attributeRadioId,
    },
    {
      name: "X-Large",
      attributeId: attributeRadioId,
    },
  ]

  const languages: Prisma.LanguageCreateManyInput[] = [
    {
      code: "en-US",
      name: "English",
    },
  ]

  const [adminRoleDb] = await Promise.all([
    prisma.role.upsert({
      where: {
        name: "admin",
      },
      create: {
        name: "admin",
        permissions: {
          connectOrCreate: allPer.map((per) => ({
            where: {
              action_resource: {
                action: per.action,
                resource: per.resource,
              },
            },
            create: {
              action: per.action,
              resource: per.resource,
            },
          })),
        },
      },
      update: {
        permissions: {
          connectOrCreate: allPer.map((per) => ({
            where: {
              action_resource: {
                action: per.action,
                resource: per.resource,
              },
            },
            create: {
              action: per.action,
              resource: per.resource,
            },
          })),
        },
      },
      include: {
        permissions: true,
      },
    }),
    prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    }),
    prisma.attribute.createMany({
      data: attributes,
      skipDuplicates: true,
    }),
    prisma.language.createMany({
      data: languages,
      skipDuplicates: true,
    }),
  ])

  const accounts: Prisma.AccountCreateManyInput[] = [
    {
      username: "admin",
      password: "$2b$10$a7W9rbM/qskWgrsq1yc9rulssXAp34ihmNAn.sk1pwTw1sfv1JlZ.",
      type: EUserOrAccountType.STAFF,
      userId: userAdminId,
      roleId: adminRoleDb!.id,
    },
    {
      username: "admin2",
      password: "$2b$10$a7W9rbM/qskWgrsq1yc9rulssXAp34ihmNAn.sk1pwTw1sfv1JlZ.",
      type: EUserOrAccountType.STAFF,
      userId: userAdmin2Id,
      roleId: adminRoleDb!.id,
    },
  ]

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
