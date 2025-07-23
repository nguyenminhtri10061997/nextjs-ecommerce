"use client";

import { getS3ImgFullUrl, textToSlug } from "@/common";
import AppImageUpload from "@/components/AppImageUpload";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { TForm } from "./useIndex";

type TProps = {
  file?: File | null;
  logoUrl?: string | null;
  onGetForm: (form: UseFormReturn<TForm>) => void;
  onUploading: (isUploading: boolean) => void;
};
export default function Index(props: TProps) {
  const { form } = useIndex();
  const { onUploading } = props;

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

      <Controller
        name="logoImage"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel>Logo</FormLabel>
            <AppImageUpload
              url={getS3ImgFullUrl(field.value)}
              onChange={(file: File, key?: string | null) => {
                field.onChange(key);
              }}
              onUploading={onUploading}
              width={75}
              height={75}
              iconFontSize={15}
              isCallUploadWhenOnChange
              onDelete={() =>field.onChange(null)}
            />
          </FormControl>
        )}
      />
    </Stack>
  );
}
