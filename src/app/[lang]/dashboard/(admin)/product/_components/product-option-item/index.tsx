import { handleNumberChange } from "@/common/client"
import AppSortableItem from "@/components/customComponents/AppSortableItem"
import { Delete as DeleteIcon } from "@mui/icons-material"
import { IconButton, MenuItem, TextField } from "@mui/material"
import { EPriceModifierType, OptionItem } from "@prisma/client"
import React from "react"
import {
  Controller,
  FieldArrayWithId,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { TForm } from "../product-form/useIndex"

type TProps = {
  idxPO: number
  idxPOI: number
  field: FieldArrayWithId<
    TForm,
    `productOptions.${number}.productOptItems`,
    "id"
  >
  optionItemsOpt: OptionItem[]
  isLoading: boolean
  remove: (index?: number | number[]) => void
  isRenderDeleteBtn: boolean
  poiSelectedMemo: {
    idx: number
    optionItemId: string
  }[]
}

export default React.memo(function Index(props: TProps) {
  const {
    idxPO,
    idxPOI,
    field: fieldProps,
    optionItemsOpt = [],
    isLoading,
    isRenderDeleteBtn,
    poiSelectedMemo,
    remove,
  } = props
  const form = useFormContext<TForm>()
  const { control } = form

  const priceModifierTypeWatch = useWatch({
    control,
    name: `productOptions.${idxPO}.productOptItems.${idxPOI}.priceModifierType`,
  })

  return (
    <AppSortableItem id={fieldProps.id}>
      <Controller
        name={`productOptions.${idxPO}.productOptItems.${idxPOI}.optionItemId`}
        control={control}
        rules={{ required: "Option Item is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Option Item"
            required
            select
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            value={field.value}
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
              optionItemsOpt?.map((poi) => {
                const disabled = poiSelectedMemo?.some(
                  (i) => i.idx !== idxPOI && i.optionItemId === poi.id
                )
                return (
                  <MenuItem key={poi.id} value={poi.id} disabled={disabled}>
                    {poi.name}
                  </MenuItem>
                )
              })
            )}
          </TextField>
        )}
      />

      <Controller
        name={`productOptions.${idxPO}.productOptItems.${idxPOI}.priceModifierType`}
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
              )
            })}
          </TextField>
        )}
      />

      {priceModifierTypeWatch !== "FREE" && (
        <Controller
          name={`productOptions.${idxPO}.productOptItems.${idxPOI}.priceModifierValue`}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Price Value"
              type="number"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || " "}
              value={field.value ?? ""}
              onChange={(e) => {
                handleNumberChange(e, field.onChange)
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
      )}

      {isRenderDeleteBtn && (
        <IconButton
          onClick={() => {
            remove(idxPOI)
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </AppSortableItem>
  )
})
