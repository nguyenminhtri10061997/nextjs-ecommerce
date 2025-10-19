"use client";

import { textToSlug } from "@/common/client";
import AppImageUpload from "@/components/customComponents/appImageUpload";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ETagDisplayType } from "@prisma/client";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { TForm } from "./useIndex";
import AppColorPicker from "@/components/customComponents/appColorPicker";

type TProps = {
  file?: File | null;
  logoUrl?: string | null;
  onGetForm: (form: UseFormReturn<TForm>) => void;
  onChangeFile?: (file: File) => void;
  onDeleteFile?: (file?: File | null, url?: TProps["logoUrl"]) => void;
};
export default function Index(props: TProps) {
  const { form } = useIndex();
  const { file, logoUrl, onGetForm, onChangeFile, onDeleteFile } = props;

  useEffect(() => {
    onGetForm(form);
  }, [form, onGetForm]);

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

  const displayType = form.watch("displayType");

  return (
    <Stack direction={"column"} gap={2}>
      <Controller
        name="code"
        control={control}
        rules={{ required: "Code is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Code"
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
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Description"
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
        name="expiredAfterDays"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Expired After Days"
            type="number"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                field.onChange(val === "" ? "" : Number(val));
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
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                field.onChange(val === "" ? "" : Number(val));
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
        name="displayType"
        control={control}
        rules={{ required: "Display Type is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Display Type"
            select
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
          >
            {Object.values(ETagDisplayType).map((i) => {
              return (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              );
            })}
          </TextField>
        )}
      />

      {displayType === "TEXT_BACKGROUND" && (
        <Controller
          name="bgColor"
          control={control}
          render={({ field }) => {
            return (
              <FormControl>
                <FormLabel>Background Color</FormLabel>
                <Box>
                  <AppColorPicker
                    value={field.value || "#FFF"}
                    onChange={(color) => form.setValue("bgColor", color)}
                    width={50}
                    height={50}
                  />
                </Box>
              </FormControl>
            );
          }}
        />
      )}
      {(displayType === "TEXT_IMAGE" || displayType === "IMAGE_ONLY") && (
        <AppImageUpload
          file={file}
          url={logoUrl}
          onChange={onChangeFile}
          onDelete={onDeleteFile}
        />
      )}
    </Stack>
  );
}
