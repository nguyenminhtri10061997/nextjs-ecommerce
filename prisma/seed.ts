import { PrismaClient, Prisma, EPermissionAction, EPermissionResource, EUserOrAccountType } from "@prisma/client";

const prisma = new PrismaClient();

const permissionData: Prisma.PermissionCreateOrConnectWithoutRolesInput[] = []
Object.values(EPermissionResource).forEach(rs => {
    Object.values(EPermissionAction).forEach(ac => {
        permissionData.push({
            where: {
                action_resource: {
                    resource: rs,
                    action: ac,
                }
            },
            create: {
                resource: rs,
                action: ac,
            }
        })
    })
})

const userDatas: Prisma.UserCreateInput[] = [
    {
        id: '5a17166a-746f-42cf-90ce-8eb7db632b95',
        fullName: 'admin',
        type: "STAFF",
        account: {
            connectOrCreate: {
                where: {
                    id: '84da89c6-69b3-43bc-8927-b28cc3877666',
                },
                create: {
                    id: '84da89c6-69b3-43bc-8927-b28cc3877666',
                    username: 'admin',
                    password: '$2b$10$a7W9rbM/qskWgrsq1yc9rulssXAp34ihmNAn.sk1pwTw1sfv1JlZ.',
                    type: EUserOrAccountType.STAFF,
                    role: {
                        connectOrCreate: {
                            where: {
                                id: '33956ec7-b5db-4938-b978-75656e45d147'
                            },
                            create: {
                                id: '33956ec7-b5db-4938-b978-75656e45d147',
                                name: 'admin',
                                permissions: {
                                    connectOrCreate: permissionData
                                }
                            },
                        }
                    }
                }
            }
        }
    },
    {
        id: '5a17166a-746f-42cf-90ce-8eb7db632b96',
        fullName: 'admin2',
        type: "STAFF",
        account: {
            connectOrCreate: {
                where: {
                    id: '84da89c6-69b3-43bc-8927-b28cc3877667',
                },
                create: {
                    id: '84da89c6-69b3-43bc-8927-b28cc3877667',
                    username: 'admin2',
                    password: '$2b$10$a7W9rbM/qskWgrsq1yc9rulssXAp34ihmNAn.sk1pwTw1sfv1JlZ.',
                    type: EUserOrAccountType.STAFF,
                    role: {
                        connectOrCreate: {
                            where: {
                                id: '33956ec7-b5db-4938-b978-75656e45d147'
                            },
                            create: {
                                id: '33956ec7-b5db-4938-b978-75656e45d147',
                                name: 'admin',
                                permissions: {
                                    connectOrCreate: permissionData
                                }
                            },
                        }
                    }
                }
            }
        }
    },
]


export async function main() {
    await Promise.all(userDatas.map(userData =>
        prisma.user.upsert({
            where: {
                id: userData.id,
            },
            create: userData,
            update: userData,
        }),
    ));
}

main().finally(() => {
    prisma.$disconnect()
});
