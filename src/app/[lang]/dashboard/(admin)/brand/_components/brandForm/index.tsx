"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { TForm } from "./useIndex";
import { textToSlug } from "@/common/client";
import AppImageUpload from "@/components/customComponents/appImageUpload";
import { Checkbox, FormControlLabel } from "@mui/material";

type TProps = {
  file?: File | null;
  logoUrl?: string | null;
  onGetForm: (form: UseFormReturn<TForm>) => void;
  onChangeFile?: (file: File) => void;
  onDeleteFile?: (file?: File | null, url?: TProps["logoUrl"]) => void;
};
export default function Index(props: TProps) {
  const { form } = useIndex();
  const { onChangeFile, onDeleteFile } = props;

  useEffect(() => {
    props.onGetForm(form);
  }, [form, props]);

  useEffect(() => {
    const callback = form.subscribe({
      name: "name",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        if (values.name) {
          form.setValue("slug", textToSlug(values.name));
        }
      },
    });

    return () => callback();
  }, [form]);

  const { control } = form;

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
        name="isActive"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Is Active"
            control={
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
              />
            }
          />
        )}
      />

      <AppImageUpload
        file={props.file}
        url={props.logoUrl}
        onChange={onChangeFile}
        onDelete={onDeleteFile}
      />
    </Stack>
  );
}
