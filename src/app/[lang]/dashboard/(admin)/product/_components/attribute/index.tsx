import { handleDragEnd } from "@/common/client"
import AppSortableItem from "@/components/customComponents/AppSortableItem"
import useAppUseSensors from "@/components/hooks/useSensors"
import { closestCenter, DndContext } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material"
import { EAttributeStatus, Prisma } from "@prisma/client"
import { UseQueryResult } from "@tanstack/react-query"
import React from "react"
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFormContext,
} from "react-hook-form"
import { v4 } from "uuid"
import AttributeAttValItem from "../attribute-val"
import { TForm } from "../product-form/useIndex"
import { TAttAndAttValHash } from "../variable-form/constants"
import useIndex from "./useIndex"

type TProps = {
  idx: number
  field: FieldArrayWithId<TForm, "attributes", "id">
  queryAtt: UseQueryResult<
    Prisma.AttributeGetPayload<{ include: { attributeValues: true } }>[]
  >
  productAttArrField: UseFieldArrayReturn<TForm, "attributes">
  attAndAttValHash: TAttAndAttValHash
}

export default React.memo(function Index(props: TProps) {
  const {
    idx: idxProps,
    field: fieldProps,
    queryAtt,
    productAttArrField,
    attAndAttValHash,
  } = props
  const form = useFormContext<TForm>()
  const { control } = form
  const {
    productAttValArrField,
    attributeIdsSelectedMemo,
    attVsMemo,
    attVIdsSelectedMemo,
    handleFillAttValsByExistAtt,
  } = useIndex({
    form,
    idx: idxProps,
    queryAtt,
    attAndAttValHash,
  })

  const sensors = useAppUseSensors()

  return (
    <Box>
      <AppSortableItem id={fieldProps.id}>
        <Controller
          name={`attributes.${idxProps}.attributeId`}
          control={control}
          rules={{ required: "Attribute is required" }}
          render={({ field, fieldState }) => (
            <TextField
              label="Attribute"
              select
              error={!!fieldState.error}
              helperText={fieldState.error?.message || " "}
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(e.target.value)
                handleFillAttValsByExistAtt(e.target.value)
              }}
              onBlur={field.onBlur}
              inputRef={field.ref}
              sx={{ width: "30%" }}
            >
              {queryAtt.isLoading ? (
                <MenuItem disabled value="">
                  Loading...
                </MenuItem>
              ) : (
                queryAtt.data?.map((at) => {
                  const disabled = attributeIdsSelectedMemo?.some(
                    (i) => i.idx !== idxProps && i.attributeId === at.id
                  )
                  return (
                    <MenuItem key={at.id} value={at.id} disabled={disabled}>
                      {at.name}
                    </MenuItem>
                  )
                })
              )}
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
        <Controller
          name={`attributes.${idxProps}.isUsedForVariations`}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="Is Used For Variations"
              control={
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                />
              }
            />
          )}
        />
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            productAttValArrField.append({
              id: v4(),
              status: "ACTIVE",
              attributeValueId: "",
            })
          }
          color="info"
        >
          Add Value
        </Button>
        <IconButton
          onClick={() => {
            productAttArrField.remove(idxProps)
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
            `attributes.${idxProps}.productAttValues`,
            productAttValArrField
          )}
        >
          <SortableContext
            items={productAttValArrField.fields.map((i) => i.id)}
          >
            {productAttValArrField.fields.map((field, idx) => (
              <AttributeAttValItem
                key={field.id}
                idxAtt={idxProps}
                idxAttVal={idx}
                attributeValues={attVsMemo}
                productAttValArrField={productAttValArrField}
                isRenderDeleteBtn={productAttValArrField.fields.length > 1}
                attVIdsSelectedMemo={attVIdsSelectedMemo}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  )
})
