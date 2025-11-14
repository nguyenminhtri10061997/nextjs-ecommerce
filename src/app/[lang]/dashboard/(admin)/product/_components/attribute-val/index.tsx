import { getS3ImgFullUrl } from "@/common"
import AppImageUpload from "@/components/customComponents/AppImageUpload"
import AppSortableItem from "@/components/customComponents/AppSortableItem"
import { Delete as DeleteIcon } from "@mui/icons-material"
import { FormControl, IconButton, MenuItem, TextField } from "@mui/material"
import { AttributeValue, EAttributeValueStatus } from "@prisma/client"
import React from "react"
import {
  Controller,
  UseFieldArrayReturn,
  useFormContext,
} from "react-hook-form"
import { TForm } from "../product-form/useIndex"

type TProps = {
  idxAtt: number
  idxAttVal: number
  productAttValArrField: UseFieldArrayReturn<
    TForm,
    `attributes.${number}.productAttValues`,
    "id"
  >
  isRenderDeleteBtn?: boolean
  attributeValues: AttributeValue[]
  attVIdsSelectedMemo: {
    attVId: string
    idx: number
  }[]
}

export default React.memo(function Index(props: TProps) {
  const {
    idxAtt,
    idxAttVal,
    productAttValArrField,
    isRenderDeleteBtn = true,
    attributeValues,
    attVIdsSelectedMemo,
  } = props
  const { control } = useFormContext<TForm>()

  return (
    <AppSortableItem id={idxAttVal}>
      <Controller
        name={`attributes.${idxAtt}.productAttValues.${idxAttVal}.image`}
        control={control}
        render={({ field }) => (
          <FormControl>
            <AppImageUpload
              url={getS3ImgFullUrl(field.value)}
              onChange={(file: File, key?: string | null) => {
                field.onChange(key)
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
        name={`attributes.${idxAtt}.productAttValues.${idxAttVal}.attributeValueId`}
        control={control}
        rules={{ required: "Attribute Value is required" }}
        render={({ field, fieldState }) => (
          <TextField
            label="Attribute Value"
            select
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            value={field.value ?? ""}
            onBlur={field.onBlur}
            inputRef={field.ref}
            sx={{ width: "30%" }}
            onChange={field.onChange}
          >
            {attributeValues?.map((atv) => {
              const disabled = attVIdsSelectedMemo?.some(
                (i) => i.idx !== idxAttVal && i.attVId === atv.id
              )
              return (
                <MenuItem key={atv.id} value={atv.id} disabled={disabled}>
                  {atv.name}
                </MenuItem>
              )
            })}
          </TextField>
        )}
      />

      <Controller
        name={`attributes.${idxAtt}.productAttValues.${idxAttVal}.status`}
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
            productAttValArrField.remove(idxAttVal)
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </AppSortableItem>
  )
})
