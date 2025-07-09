"use client";
import { useGetRoleListQuery } from "@/lib/reactQuery/role";
import { Account, User } from "@prisma/client";
import { useForm } from "react-hook-form";

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
  const form = useForm<Inputs>({
    mode: "onBlur",
  });

  return {
    form,
    queryRole,
  };
}
