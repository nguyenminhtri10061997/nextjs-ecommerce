import { textToSlug } from "@/common";
import AppImageUpload from "@/components/AppImageUpload";
import AppSortableItem from "@/components/AppSortableItem";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Autocomplete,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { EAttributeValueStatus, Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  idxAtt: number;
  idxAttVal: number;
  queryAtt: UseQueryResult<
    Prisma.AttributeGetPayload<{ include: { attributeValues: true } }>[]
  >;
  form: UseFormReturn<TForm>;
  productAttValArrField: UseFieldArrayReturn<
    TForm,
    `attributes.${number}.attributeValues`,
    "id"
  >;
};

export default function Index(props: TProps) {
  const { idxAtt, idxAttVal, queryAtt, form, productAttValArrField } = props;
  const { control } = form;

  useEffect(() => {
    const callback = form.subscribe({
      name: `attributes.${idxAtt}.attributeValues.${idxAttVal}.name`,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        const name =
          values.attributes?.[idxAtt]?.attributeValues?.[idxAttVal].name;
        if (name) {
          form.setValue(
            `attributes.${idxAtt}.attributeValues.${idxAttVal}.slug`,
            textToSlug(name)
          );
        }
      },
    });

    return () => callback();
  }, [form, idxAtt, idxAttVal]);

  return (
    <AppSortableItem id={idxAttVal}>
      <Controller
        name={`attributes.${idxAtt}.attributeValues.${idxAttVal}.image`}
        control={control}
        render={({ field }) => (
          <FormControl>
            <AppImageUpload
              file={field.value?.file}
              url={field.value?.url}
              onChange={(file: File) => {
                field.onChange({ file });
              }}
              width={75}
              height={75}
              iconFontSize={15}
            />
          </FormControl>
        )}
      />

      <Controller
        name={`attributes.${idxAtt}.attributeValues.${idxAttVal}.name`}
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
        name={`attributes.${idxAtt}.attributeValues.${idxAttVal}.slug`}
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
        name={`attributes.${idxAtt}.attributeValues.${idxAttVal}.status`}
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
            <MenuItem value={EAttributeValueStatus.ACTIVE}>
              {EAttributeValueStatus.ACTIVE}
            </MenuItem>

            <MenuItem value={EAttributeValueStatus.INACTIVE_BY_ADMIN}>
              {EAttributeValueStatus.INACTIVE_BY_ADMIN}
            </MenuItem>
          </TextField>
        )}
      />
      <IconButton
        onClick={() => {
          productAttValArrField.remove(idxAttVal);
        }}
        color="error"
        sx={{ mt: 1 }}
      >
        <DeleteIcon />
      </IconButton>
    </AppSortableItem>
  );
}
