"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { TForm } from "./useIndex";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { textToSlug } from "@/common";

type TProps = {
  onGetForm: (form: UseFormReturn<TForm>) => void;
};
export default function Index(props: TProps) {
  const {
    form,
    attributeValueArrField,
    handleRemoveAttValue,
    handleAddAttValue,
    handleChangeAttValue,
  } = useIndex();

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
        form.setValue("slug", textToSlug(values.name));
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

      <Toolbar disableGutters>
        <Button
          onClick={handleAddAttValue}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Attribute
        </Button>
      </Toolbar>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {attributeValueArrField.fields.map((item, index) => (
              <TableRow key={item.id || index}>
                <TableCell>
                  <Controller
                    name={`attributeValues.${index}.name`}
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
                        onChange={handleChangeAttValue(index, field.onChange)}
                        onBlur={field.onBlur}
                        inputRef={field.ref}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`attributeValues.${index}.slug`}
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
                </TableCell>
                <TableCell>
                  <IconButton onClick={handleRemoveAttValue(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
