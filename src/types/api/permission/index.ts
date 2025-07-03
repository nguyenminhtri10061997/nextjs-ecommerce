import { Permission } from "@prisma/client";
import { TPaginationResponse } from "../common";

export type TGetPermissionListResponse = {
  data: Permission[];
  pagination: TPaginationResponse;
};
