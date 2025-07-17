import AppSortableItem from "@/components/AppSortableItem";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { EAttributeStatus, Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { TForm } from "../product-form/useIndex";
import useIndex from "./useIndex";
import { handleDragEnd } from "@/common/indexClient";
import { useEffect } from "react";
import { textToSlug } from "@/common";
import AppImageUpload from "@/components/AppImageUpload";

type TProps = {
  idx: number;
  field: FieldArrayWithId<TForm, "attributes", "id">;
  queryAtt: UseQueryResult<
    Prisma.AttributeGetPayload<{ include: { attributeValues: true } }>[]
  >;
  form: UseFormReturn<TForm>;
  productAttArrField: UseFieldArrayReturn<TForm, "attributes">;
};

export default function Index(props: TProps) {
  const {
    idx: idxProps,
    field: fieldProps,
    queryAtt,
    form,
    productAttArrField,
  } = props;
  const { control } = form;
  const { productAttValArrField } = useIndex({
    form,
    idx: idxProps,
    queryAtt,
  });

  useEffect(() => {
    const callback = form.subscribe({
      name: `attributes.${idxProps}.name`,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        const name = values.attributes?.[idxProps]?.name;
        if (name) {
          form.setValue(`attributes.${idxProps}.slug`, textToSlug(name));
        }
      },
    });

    return () => callback();
  }, [form, idxProps]);

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

  return (
    <Box>
      <AppSortableItem id={fieldProps.id}>
        <Controller
          name={`attributes.${idxProps}.image`}
          control={control}
          render={({ field }) => (
            <FormControl>
              <AppImageUpload
                file={field.value.file}
                url={field.value.url}
                onChange={(file: File) => {
                  field.onChange({ file });
                }}
                showDeleteBtn={false}
              />
            </FormControl>
          )}
        />
        <Controller
          name={`attributes.${idxProps}.name`}
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field, fieldState }) => (
            <Autocomplete
              freeSolo
              options={queryAtt.data?.map((option) => option.name) || []}
              value={field.value ?? ""}
              sx={{ width: "20%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || " "}
                  inputRef={field.ref}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value ?? ""}
                />
              )}
            />
          )}
        />
        <Controller
          name={`attributes.${idxProps}.slug`}
          control={control}
          rules={{ required: "Slug is required" }}
          render={({ field, fieldState }) => (
            <TextField
              label="Slug"
              sx={{ width: "20%" }}
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

        <Controller
          name={`attributes.${idxProps}.status`}
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field, fieldState }) => (
            <TextField
              label="Status"
              select
              error={!!fieldState.error}
              helperText={fieldState.error?.message || " "}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              sx={{ width: "20%" }}
            >
              {Object.values(EAttributeStatus)?.map((i) => {
                return (
                  <MenuItem key={i} value={i}>
                    {i}
                  </MenuItem>
                );
              })}
            </TextField>
          )}
        />
        <IconButton
          onClick={() =>
            productAttValArrField.append({
              name: "",
              slug: "",
              status: "ACTIVE",
            })
          }
          color="info"
          sx={{ mt: 1 }}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            productAttArrField.remove(idxProps);
          }}
          color="error"
          sx={{ mt: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </AppSortableItem>
      <Box sx={{ ml: 5 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd(
            form,
            `attributes.${idxProps}.attributeValues`,
            productAttValArrField
          )}
        >
          <SortableContext
            items={productAttValArrField.fields.map((i) => i.id)}
          >
            {productAttValArrField.fields.map((field, idx) => (
              <AppSortableItem key={field.id} id={field.id}>
                <IconButton
                  onClick={() => {
                    productAttValArrField.remove(idx);
                  }}
                  color="error"
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </AppSortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
}
