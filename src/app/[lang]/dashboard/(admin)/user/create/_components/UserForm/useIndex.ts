"use client"
import { PostUserCreateBodyDTO } from "@/app/api/user/validator"
import useAppUseForm from "@/constants/reactHookForm"
import { useGetRoleListQuery } from "@/lib/reactQuery/role"
import { output } from "zod/v4"

export type FormInputs = output<typeof PostUserCreateBodyDTO>

export default function useIndex() {
  const queryRole = useGetRoleListQuery()
  const form = useAppUseForm<FormInputs>({
    defaultValues: {
      type: "STAFF",
    },
  })

  return {
    form,
    queryRole,
  }
}
