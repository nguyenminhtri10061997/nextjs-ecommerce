"use client";

import { handleNumberChange, textToSlug } from "@/common";
import AppSortableItem from "@/components/AppRowSortable";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Toolbar,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import useIndex, { TForm } from "./useIndex";
import { EAttributeType } from "@prisma/client";

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const attributeValuesFromForm = form.getValues("attributeValues");
      const oldIndex = attributeValuesFromForm.findIndex(
        (i) => i.idDnD === active.id
      );
      const newIndex = attributeValuesFromForm.findIndex(
        (i) => i.idDnD === over?.id
      );

      const attributeValuesMoved = arrayMove(
        attributeValuesFromForm,
        oldIndex,
        newIndex
      );
      form.setValue("attributeValues", attributeValuesMoved);
    }
  };
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
        name={"type"}
        control={control}
        rules={{ required: "Type is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Type"
            select
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
          >
            <MenuItem value={EAttributeType.RADIO}>
              {EAttributeType.RADIO}
            </MenuItem>
            <MenuItem value={EAttributeType.COLOR}>
              {EAttributeType.COLOR}
            </MenuItem>
          </TextField>
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
            onChange={(e) => handleNumberChange(e, field.onChange)}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={attributeValueArrField.fields.map((i) => i.idDnD)}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableBody>
                {attributeValueArrField.fields.map((i, idx) => (
                  <AppSortableItem key={i.idDnD} id={i.idDnD}>
                    <TableCell>
                      <Controller
                        name={`attributeValues.${idx}.name`}
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field, fieldState }) => (
                          <TextField
                            label="Name"
                            fullWidth
                            required
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || " "}
                            value={field.value ?? ""}
                            onChange={handleChangeAttValue(idx, field.onChange)}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`attributeValues.${idx}.slug`}
                        control={control}
                        rules={{ required: "Slug is required" }}
                        render={({ field, fieldState }) => (
                          <TextField
                            label="Slug"
                            fullWidth
                            required
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || " "}
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={handleRemoveAttValue(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </AppSortableItem>
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </TableContainer>
    </Stack>
  );
}
