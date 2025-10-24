import { textToSlug } from "@/common";
import { handleDragEnd } from "@/common/indexClient";
import AppSortableItem from "@/components/customComponents/AppSortableItem";
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
  Button,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { EAttributeStatus, EAttributeType, Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { v4 } from "uuid";
import AttributeAttValItem from "../attribute-val";
import { TForm } from "../product-form/useIndex";
import useIndex from "./useIndex";

type TProps = {
  idx: number;
  field: FieldArrayWithId<TForm, "attributes", "id">;
  queryAtt: UseQueryResult<
    Prisma.AttributeGetPayload<{ include: { attributeValues: true } }>[]
  >;
  form: UseFormReturn<TForm>;
  productAttArrField: UseFieldArrayReturn<TForm, "attributes">;
};

export default React.memo(function Index(props: TProps) {
  const {
    idx: idxProps,
    field: fieldProps,
    queryAtt,
    form,
    productAttArrField,
  } = props;
  const { control } = form;
  const { productAttValArrField, optMemo, handleFillAttValsByExistAtt } =
    useIndex({
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
        const name = values.attributes?.[idxProps]?.name || "";
        form.setValue(`attributes.${idxProps}.slug`, textToSlug(name));
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
          name={`attributes.${idxProps}.name`}
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field, fieldState }) => (
            <Autocomplete
              freeSolo
              options={optMemo}
              value={field.value ?? ""}
              onChange={(_, option) => {
                field.onChange(option);
                if (option) {
                  handleFillAttValsByExistAtt(option);
                }
              }}
              onBlur={field.onBlur}
              sx={{ width: "20%" }}
              ref={field.ref}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Name"
                  required
                  onChange={field.onChange}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || " "}
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
          name={`attributes.${idxProps}.type`}
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
              sx={{ width: "10%" }}
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
              <MenuItem value={EAttributeStatus.ACTIVE}>
                {EAttributeStatus.ACTIVE}
              </MenuItem>
              <MenuItem value={EAttributeStatus.INACTIVE_BY_ADMIN}>
                {EAttributeStatus.INACTIVE_BY_ADMIN}
              </MenuItem>
            </TextField>
          )}
        />
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            productAttValArrField.append({
              id: v4(),
              name: "",
              slug: "",
              status: "ACTIVE",
            })
          }
          color="info"
        >
          Add Value
        </Button>
        <IconButton
          onClick={() => {
            productAttArrField.remove(idxProps);
          }}
          color="error"
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
              <AttributeAttValItem
                key={field.id}
                form={form}
                idxAtt={idxProps}
                idxAttVal={idx}
                productAttValArrField={productAttValArrField}
                isRenderDeleteBtn={productAttValArrField.fields.length > 1}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
});
