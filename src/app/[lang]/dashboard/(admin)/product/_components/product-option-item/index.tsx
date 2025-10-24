import { handleNumberChange } from "@/common";
import AppSortableItem from "@/components/customComponents/AppSortableItem";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { IconButton, MenuItem, TextField } from "@mui/material";
import { EPriceModifierType, OptionItem } from "@prisma/client";
import React, { useMemo } from "react";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { TForm } from "../product-form/useIndex";

type TProps = {
  idxPO: number;
  idxPOI: number;
  field: FieldArrayWithId<TForm, `productOptions.${number}.optionItems`, "id">;
  optionItemsOpt: OptionItem[];
  isLoading: boolean;
  productOIIdSelected: (string | null)[];
  remove: (index?: number | number[]) => void;
  isRenderDeleteBtn: boolean;
  control: Control<TForm>;
};

export default React.memo(function Index(props: TProps) {
  const {
    idxPO,
    idxPOI,
    field: fieldProps,
    optionItemsOpt = [],
    isLoading,
    productOIIdSelected,
    isRenderDeleteBtn,
    control,
    remove,
  } = props;

  const ops = useMemo(() => {
    return optionItemsOpt?.filter((op) => {
      const found = productOIIdSelected.findIndex((oi) => op.id === oi);
      if (found < 0) {
        return true;
      } else if (idxPOI === found) {
        return true;
      }
      return false;
    });
  }, [optionItemsOpt, productOIIdSelected, idxPOI]);
  const idOpt = useMemo(() => {
    return ops.map((i) => i.id);
  }, [ops]);

  return (
    <AppSortableItem id={fieldProps.id}>
      <Controller
        name={`productOptions.${idxPO}.optionItems.${idxPOI}.optionItemId`}
        control={control}
        rules={{ required: "Option Item is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Option Item"
            required
            select
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            value={idOpt.includes(field.value) ? field.value : ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            sx={{ width: "30%" }}
          >
            {isLoading ? (
              <MenuItem disabled value="">
                Loading...
              </MenuItem>
            ) : (
              ops?.map((i) => {
                return (
                  <MenuItem key={i.id} value={i.id}>
                    {i.name}
                  </MenuItem>
                );
              })
            )}
          </TextField>
        )}
      />

      <Controller
        name={`productOptions.${idxPO}.optionItems.${idxPOI}.priceModifierType`}
        control={control}
        rules={{ required: "Price Type is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Price Type"
            select
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            sx={{ width: "30%" }}
          >
            {Object.values(EPriceModifierType)?.map((i) => {
              return (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              );
            })}
          </TextField>
        )}
      />

      <Controller
        name={`productOptions.${idxPO}.optionItems.${idxPOI}.priceModifierValue`}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Price Value"
            type="number"
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            value={field.value ?? ""}
            onChange={(e) => {
              handleNumberChange(e, field.onChange);
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

      {isRenderDeleteBtn && (
        <IconButton
          onClick={() => {
            remove(idxPOI);
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </AppSortableItem>
  );
});
