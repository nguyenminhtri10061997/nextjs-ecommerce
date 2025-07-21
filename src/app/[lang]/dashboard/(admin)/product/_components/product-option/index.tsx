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
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { Prisma, EPriceModifierType } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { TForm } from "../product-form/useIndex";
import useIndex from "./useIndex";
import { handleNumberChange } from "@/common";

type TProps = {
  idx: number;
  field: FieldArrayWithId<TForm, "productOptions", "id">;
  queryOption: UseQueryResult<
    Prisma.OptionGetPayload<{ include: { optionItems: true } }>[],
    Error
  >;
  form: UseFormReturn<TForm>;
  productOptionArrField: UseFieldArrayReturn<TForm, "productOptions">;
  productOptionIdSelected: {
    idx: number;
    optionId: string;
  }[];
};

export default function Index(props: TProps) {
  const {
    idx: idxProps,
    field: fieldProps,
    queryOption,
    form,
    productOptionArrField,
    productOptionIdSelected,
  } = props;
  const { control } = form;
  const {
    productOptionItemArrField,
    productOIIdSelected,
    optionIdWatch,
    handleDragEnd,
  } = useIndex({
    form,
    idx: idxProps,
    queryOption,
  });

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
          name={`productOptions.${idxProps}.optionId`}
          control={control}
          rules={{ required: "Option is required" }}
          render={({ field, fieldState }) => (
            <TextField
              label="Option"
              select
              error={!!fieldState.error}
              helperText={fieldState.error?.message || " "}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              sx={{ width: "30%" }}
            >
              {queryOption.isLoading ? (
                <MenuItem disabled value="">
                  Loading...
                </MenuItem>
              ) : (
                queryOption.data
                  ?.filter((op) => {
                    const found = productOptionIdSelected.find(
                      (i) => i.optionId === op.id
                    );
                    if (!found) {
                      return true;
                    }
                    return idxProps === found.idx;
                  })
                  ?.map((i) => {
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
          name={`productOptions.${idxProps}.maxSelect`}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Max Select"
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
              onWheel={(e) =>
                e.target instanceof HTMLElement && e.target.blur()
              }
            />
          )}
        />
        <Controller
          name={`productOptions.${idxProps}.isRequired`}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="Is Required"
              control={
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                />
              }
            />
          )}
        />
        <IconButton
          onClick={() =>
            productOptionItemArrField.append({
              optionItemId: "",
              priceModifierType: "FREE",
              priceModifierValue: 0,
            })
          }
          color="info"
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            form.resetField(`productOptions.${idxProps}.optionId`);
            productOptionArrField.remove(idxProps);
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
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={productOptionItemArrField.fields.map((i) => i.id)}
          >
            {productOptionItemArrField.fields.map((field, idx) => (
              <AppSortableItem key={field.id} id={field.id}>
                <Controller
                  name={`productOptions.${idxProps}.optionItems.${idx}.optionItemId`}
                  control={control}
                  rules={{ required: "Option Item is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Option Item"
                      required
                      select
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      sx={{ width: "30%" }}
                    >
                      {queryOption.isLoading ? (
                        <MenuItem disabled value="">
                          Loading...
                        </MenuItem>
                      ) : (
                        (
                          queryOption.data?.find((i) => i.id === optionIdWatch)
                            ?.optionItems || []
                        )
                          ?.filter((op) => {
                            const found = productOIIdSelected.find(
                              (i) => i.optionItemId === op.id
                            );
                            if (!found) {
                              return true;
                            }
                            return idx === found.idx;
                          })
                          ?.map((i) => {
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
                  name={`productOptions.${idxProps}.optionItems.${idx}.priceModifierType`}
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
                  name={`productOptions.${idxProps}.optionItems.${idx}.priceModifierValue`}
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
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                    />
                  )}
                />

                {productOptionItemArrField.fields.length > 1 && (
                  <IconButton
                    onClick={() => {
                      productOptionItemArrField.remove(idx);
                      form.resetField(
                        `productOptions.${idxProps}.optionItems.${idx}.optionItemId`
                      );
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </AppSortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
}
