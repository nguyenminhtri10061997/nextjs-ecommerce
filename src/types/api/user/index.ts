import { User } from "@prisma/client";
import { TPaginationResponse } from "../common";

export type TGetUserListResponse = {
    data: User[],
    pagination: TPaginationResponse
}