import { Role } from "@prisma/client";
import { TPaginationResponse } from "../common";

export type TGetRoleListResponse = {
    data: Role[],
    pagination: TPaginationResponse
}