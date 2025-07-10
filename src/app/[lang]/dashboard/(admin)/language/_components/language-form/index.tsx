"use client";

import { Checkbox, FormControlLabel } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { TForm } from "./useIndex";

type TProps = {
  onGetForm: (form: UseFormReturn<TForm>) => void;
};
export default function Index(props: TProps) {
  const { form } = useIndex();

  useEffect(() => {
    props.onGetForm(form);
  }, [form, props]);

  const { control } = form;

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
        name="isDefault"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Is Default"
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
  );
}
