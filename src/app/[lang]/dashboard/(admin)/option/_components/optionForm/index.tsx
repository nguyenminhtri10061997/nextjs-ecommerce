"use client";

import { textToSlug } from "@/common";
import AppSortableItem from "@/components/customComponents/AppRowSortable";
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
  Checkbox,
  FormControlLabel,
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
    optionValueArrField,
    handleRemoveOpItemValue,
    handleAddOpItemValue,
    handleChangeOpItemValue,
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
      const optionItemsFromForm = form.getValues("optionItems");
      const oldIndex = optionItemsFromForm.findIndex(
        (i) => i.idDnD === active.id
      );
      const newIndex = optionItemsFromForm.findIndex(
        (i) => i.idDnD === over?.id
      );

      const optionItemsMoved = arrayMove(
        optionItemsFromForm,
        oldIndex,
        newIndex
      );
      form.setValue("optionItems", optionItemsMoved);
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

      <Toolbar disableGutters>
        <Button
          onClick={handleAddOpItemValue}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Option Item
        </Button>
      </Toolbar>
      <TableContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={optionValueArrField.fields.map((i) => i.idDnD)}
          >
            <Table>
              <TableBody>
                {optionValueArrField.fields.map((i, idx) => (
                  <AppSortableItem key={i.idDnD} id={i.idDnD}>
                    <TableCell>
                      <Controller
                        name={`optionItems.${idx}.name`}
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
                            onChange={handleChangeOpItemValue(idx, field.onChange)}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`optionItems.${idx}.slug`}
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
                      <Controller
                        name={`optionItems.${idx}.isActive`}
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
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={handleRemoveOpItemValue(idx)}>
                        <DeleteIcon color="error" />
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
