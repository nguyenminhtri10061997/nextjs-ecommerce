import { getS3ImgFullUrl, textToSlug } from "@/common";
import AppImageUpload from "@/components/customComponents/AppImageUpload";
import AppSortableItem from "@/components/customComponents/AppSortableItem";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FormControl, IconButton, MenuItem, TextField } from "@mui/material";
import { EAttributeValueStatus } from "@prisma/client";
import React, { useEffect } from "react";
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  idxAtt: number;
  idxAttVal: number;
  form: UseFormReturn<TForm>;
  productAttValArrField: UseFieldArrayReturn<
    TForm,
    `attributes.${number}.attributeValues`,
    "id"
  >;
  isRenderDeleteBtn?: boolean;
};

export default React.memo(function Index(props: TProps) {
  const {
    idxAtt,
    idxAttVal,
    form,
    productAttValArrField,
    isRenderDeleteBtn = true,
  } = props;
  const { control } = form;

  useEffect(() => {
    const callback = form.subscribe({
      name: `attributes.${idxAtt}.attributeValues.${idxAttVal}.name`,
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        const name =
          values.attributes?.[idxAtt]?.attributeValues?.[idxAttVal].name || "";
        form.setValue(
          `attributes.${idxAtt}.attributeValues.${idxAttVal}.slug`,
          textToSlug(name)
        );
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
              url={getS3ImgFullUrl(field.value)}
              onChange={(file: File, key?: string | null) => {
                field.onChange(key);
              }}
              isCallUploadWhenOnChange
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
          <TextField
            sx={{ width: "20%" }}
            label="Name"
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            inputRef={field.ref}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value ?? ""}
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
      {isRenderDeleteBtn && (
        <IconButton
          onClick={() => {
            productAttValArrField.remove(idxAttVal);
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </AppSortableItem>
  );
});
