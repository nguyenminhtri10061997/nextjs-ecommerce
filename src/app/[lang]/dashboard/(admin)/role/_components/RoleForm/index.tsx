"use client";

import {
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { Inputs } from "./useIndex";
import { TPermissionState } from "../../create/usePage";

type TProps = {
  onGetForm: (form: UseFormReturn<Inputs>) => void;
  isEdit?: boolean;
  permissionSelected: TPermissionState;
  handleChangeCheckbox: (
    id: string
  ) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export default function RoleForm(props: TProps) {
  const { permissionSelected, handleChangeCheckbox } = props;

  const { form, tableData, queryPermissions } = useIndex();

  useEffect(() => {
    props.onGetForm(form);
  }, [form, props]);

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
      {!!queryPermissions.isLoading && <CircularProgress />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Resource</TableCell>
            {Object.values(EPermissionAction).map((ac) => (
              <TableCell key={ac}>{ac}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(EPermissionResource).map((rs) => {
            return (
              <TableRow key={rs}>
                <TableCell>{rs}</TableCell>
                {Object.values(EPermissionAction).map((ac) => {
                  const id = tableData[rs]?.[ac];
                  return (
                    <TableCell key={ac}>
                      {id && (
                        <Checkbox
                          checked={permissionSelected[id] || false}
                          onChange={handleChangeCheckbox(id)}
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Stack>
  );
}
