"use client";

import { textToSlug } from "@/common";
import AppSortableItem from "@/components/AppSortableItem";
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

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;

  //   if (active.id !== over?.id) {
  //     const oldIndex = attributeValueArrField.fields.findIndex((_, idx) => idx === active.id);
  //     const newIndex = attributeValueArrField.fields.findIndex((_, idx) => idx === over?.id);

  //     const attributeValuesMoved = arrayMove(attributeValueArrField.fields, oldIndex, newIndex)
  //     form.setValue('attributeValues', attributeValuesMoved)
  //   }
  // };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          // onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={attributeValueArrField.fields.map((i, idx) =>i.id)}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {attributeValueArrField.fields.map((item, index) => (
                  <AppSortableItem key={index} id={`${index}`}>
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
                            onChange={handleChangeAttValue(
                              index,
                              field.onChange
                            )}
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
