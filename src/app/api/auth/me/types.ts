import { Account, EPermissionAction, EPermissionResource, Role } from "@prisma/client";

export type TPostMeResponse = {
    account: Account,
    role: Pick<Role, "id" | "name"> & {
        permissions: {
            [resource in EPermissionResource]?: EPermissionAction[];
        };
    }
}