import { handleDragEnd } from "@/common/client"
import AppButtonConfirm from "@/components/customComponents/AppButtonConfirm"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import AddIcon from "@mui/icons-material/Add"
import { Button, FormControl, FormLabel, Toolbar } from "@mui/material"
import { useFormContext } from "react-hook-form"
import { v4 } from "uuid"
import AttributeItem from "../attribute"
import { TForm } from "../product-form/useIndex"
import SkuVariableForm from "../sku-variable-form"
import useIndex from "./useIndex"

export default function Index() {
  const form = useFormContext<TForm>()

  const {
    queryAtt,
    productAttArrField,
    skuArrField,
    paHashMemo,
    attAndAttValHash,
    handleClickGenSku,
    handleClickDeleteSku,
  } = useIndex({
    form,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <>
      <FormControl>
        <FormLabel>Attribute</FormLabel>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd(form, "attributes", productAttArrField)}
        >
          <SortableContext items={productAttArrField.fields.map((i) => i.id)}>
            {productAttArrField.fields.map((field, idx) => (
              <AttributeItem
                key={field.id}
                field={field}
                idx={idx}
                productAttArrField={productAttArrField}
                queryAtt={queryAtt}
                attAndAttValHash={attAndAttValHash}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Toolbar disableGutters>
          <Button
            onClick={() =>
              productAttArrField.append({
                id: v4(),
                status: "ACTIVE",
                attributeId: "",
                isUsedForVariations: true,
                productAttValues: [],
              })
            }
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Attribute
          </Button>
        </Toolbar>
      </FormControl>

      <FormControl>
        <FormLabel>Sku</FormLabel>
        <Toolbar disableGutters>
          <AppButtonConfirm
            onOk={handleClickGenSku}
            buttonProps={{
              variant: "contained",
              startIcon: <AddIcon />,
            }}
            contentModal="All existing sku will be deleted. Are you sure?"
          >
            Generate sku combination
          </AppButtonConfirm>
        </Toolbar>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd(form, "skus", skuArrField)}
        >
          <SortableContext items={skuArrField.fields.map((i) => i.id)}>
            {skuArrField.fields.map((field, idx) => {
              return (
                <SkuVariableForm
                paHashMemo={paHashMemo}
                  attAndAttValHash={attAndAttValHash}
                  key={field.id}
                  form={form}
                  idx={idx}
                  handleClickDeleteSku={handleClickDeleteSku}
                />
              )
            })}
          </SortableContext>
        </DndContext>
      </FormControl>
    </>
  )
}
