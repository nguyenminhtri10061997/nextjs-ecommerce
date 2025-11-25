"use client"

import AppTextFieldPassword from "@/components/customComponents/AppTexFieldPassword"
import { Autocomplete, Checkbox, FormControlLabel } from "@mui/material"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { EUserOrAccountType, Role } from "@prisma/client"
import { useEffect } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import useIndex, { FormInputs } from "./useIndex"

type TProps = {
  onGetForm: (form: UseFormReturn<FormInputs>) => void
}

export default function UserForm(props: TProps) {
  const { form, queryRole, newPasswordWatch } = useIndex()

  useEffect(() => {
    props.onGetForm(form)
  }, [form, props])

  const { control } = form

  return (
    <>
      <Card variant="outlined">
        <CardHeader title="User Info" />
        <CardContent>
          <Stack direction={"column"} gap={2}>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Fullname is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              rules={{ required: "Type is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Type"
                  select
                  required
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                >
                  {Object.keys(EUserOrAccountType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mt: 1 }}>
        <CardHeader title="Account Info" />
        <CardContent>
          <Stack direction={"column"} gap={2}>
            <Controller
              name="account.username"
              control={control}
              rules={{ required: "Username is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Username"
                  required
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />

            <Controller
              name="account.newPassword"
              control={control}
              render={({ field, fieldState }) => (
                <AppTextFieldPassword
                  label={"New Password"}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  type="text"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />

            <Controller
              name={"newPasswordConfirm"}
              control={control}
              rules={{
                required: !!newPasswordWatch
                  ? "Confirm New Password is required"
                  : false,
                validate: (value) => {
                  const password = form.getValues("account.newPassword")
                  if (!password) return true
                  return password === value || "Passwords do not match"
                },
              }}
              render={({ field, fieldState }) => (
                <AppTextFieldPassword
                  label={"Confirm New Password"}
                  required={!!newPasswordWatch}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  type="text"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />

            <Controller
              name="account.roleId"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field, fieldState }) => (
                <Autocomplete<Role>
                  fullWidth
                  options={queryRole.data?.data || []}
                  loading={queryRole.isLoading}
                  getOptionLabel={(op) => op.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={
                    queryRole.data?.data.find((i) => i.id === field.value) ??
                    null
                  }
                  onChange={(_, value) => field.onChange(value?.id ?? null)}
                  onBlur={field.onBlur}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Role"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="account.accessTokenVersion"
              control={control}
              rules={{ required: "Access Token Version is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Access Token Version"
                  type="number"
                  required
                  disabled={true}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />
            <Controller
              name="account.isBanned"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label="Is Banned"
                  control={
                    <Checkbox
                      checked={field.value ?? false}
                      onChange={field.onChange}
                    />
                  }
                />
              )}
            />

            <Controller
              name="account.isBlocked"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label="Is Blocked"
                  control={
                    <Checkbox
                      checked={field.value ?? false}
                      onChange={field.onChange}
                    />
                  }
                />
              )}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}
