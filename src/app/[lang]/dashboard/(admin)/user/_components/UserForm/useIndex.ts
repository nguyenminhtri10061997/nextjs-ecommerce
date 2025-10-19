"use client";
import useAppUseForm from "@/constants/reactHookForm";
import { useGetRoleListQuery } from "@/lib/reactQuery/role";
import { Account, User } from "@prisma/client";

export type Inputs = Pick<User, "fullName" | "type"> &
  Pick<
    Account,
    | "username"
    | "password"
    | "isBanned"
    | "isBlocked"
    | "accessTokenVersion"
    | "roleId"
  >;

export default function useIndex() {
  const queryRole = useGetRoleListQuery();
  const form = useAppUseForm<Inputs>();

  return {
    form,
    queryRole,
  };
}
