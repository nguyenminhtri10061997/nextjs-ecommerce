"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { TForm } from "./useIndex";
import { textToSlug } from "@/common";
import AppImageUpload from "@/components/AppImageUpload";

type TProps = {
  file?: File | null;
  onGetForm: (form: UseFormReturn<TForm>) => void;
  setFile?: React.Dispatch<File | null>;
};
export default function Index(props: TProps) {
  const { form, handleChangeFile, handleDeleteFile } = useIndex({
    setFile: props.setFile,
  });

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
      <AppImageUpload
        file={props.file}
        onChange={handleChangeFile}
        onDelete={handleDeleteFile}
      />
    </Stack>
  );
}
