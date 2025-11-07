"use client"

import { textToSlug } from "@/common"
import { MenuItem } from "@mui/material"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { useEffect } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import useIndex, { TForm } from "./useIndex"

type TProps = {
  editRowId?: string
  onGetForm: (form: UseFormReturn<TForm>) => void
}
export default function Index(props: TProps) {
  const { form, query } = useIndex()

  useEffect(() => {
    props.onGetForm(form)
  }, [form, props])

  useEffect(() => {
    const callback = form.subscribe({
      name: "name",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        if (values.name) {
          form.setValue("slug", textToSlug(values.name))
        }
      },
    })

    return () => callback()
  }, [form])

  const { control } = form

  return (
    <Stack direction={"column"} gap={2}>
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Name"
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
        name="slug"
        control={control}
        rules={{ required: "Slug is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Slug"
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
        name="seoTitle"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Seo Title"
            fullWidth
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
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Description"
            multiline
            minRows={3}
            fullWidth
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
        name="seoDescription"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Seo Description"
            multiline
            minRows={3}
            fullWidth
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
        name="displayOrder"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Display Order"
            type="number"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ?? ""}
            onChange={(e) => {
              const val = e.target.value
              if (/^\d*$/.test(val)) {
                field.onChange(val === "" ? "" : Number(val))
              }
            }}
            onBlur={field.onBlur}
            inputRef={field.ref}
            slotProps={{
              input: {
                inputMode: "numeric",
              },
            }}
            onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
          />
        )}
      />

      <Controller
        name="productCategoryParentId"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Product Category Parent"
            select
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
          >
            {query.isFetched ? (
              query.data?.map((pc) => {
                if (props.editRowId && pc.id === props.editRowId) {
                  return null
                }
                return (
                  <MenuItem key={pc.id} value={pc.id}>
                    {pc.name}
                  </MenuItem>
                )
              })
            ) : (
              <MenuItem disabled value="">
                Loading...
              </MenuItem>
            )}
          </TextField>
        )}
      />
    </Stack>
  )
}
