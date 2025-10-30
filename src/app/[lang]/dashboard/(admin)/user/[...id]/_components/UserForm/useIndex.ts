"use client"
import { PatchBodyDTO } from "@/app/api/user/[id]/validator"
import useAppUseForm from "@/constants/reactHookForm"
import { useGetRoleListQuery } from "@/lib/reactQuery/role"
import { useWatch } from "react-hook-form"
import { output } from "zod/v4"

export type FormInputs = output<typeof PatchBodyDTO> & {
  newPasswordConfirm: string
}

export default function useIndex() {
  const queryRole = useGetRoleListQuery()
  const form = useAppUseForm<FormInputs>({
    defaultValues: {
      type: "STAFF",
    },
  })

  const newPasswordWatch = useWatch({
    control: form.control,
    name: `account.newPassword`,
  })

  return {
    form,
    queryRole,
    newPasswordWatch,
  }
}
