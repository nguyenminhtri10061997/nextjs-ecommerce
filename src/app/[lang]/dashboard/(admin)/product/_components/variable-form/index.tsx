import { handleDragEnd } from "@/common/indexClient";
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
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Toolbar,
} from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import AttributeItem from "../attribute";
import { TForm } from "../product-form/useIndex";
import SkuItem from "../sku";
import useIndex from "./useIndex";
import AppButtonConfirm from "@/components/AppButtonConfirm";
import { v4 } from "uuid";

type TProps = {
  form: UseFormReturn<TForm>;
};
export default function Index(props: TProps) {
  const { form } = props;

  const {
    queryAtt,
    productAttArrField,
    skuArrField,
    attAndAttValHash,
    handleClickGenSku,
    handleClickDeleteSku,
  } = useIndex({
    form,
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
                form={form}
                idx={idx}
                productAttArrField={productAttArrField}
                queryAtt={queryAtt}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Toolbar disableGutters>
          <Button
            onClick={() =>
              productAttArrField.append({
                id: v4(),
                isNew: true,
                name: "",
                slug: "",
                status: "ACTIVE",
                attributeValues: [],
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd(form, "skus", skuArrField)}
        >
          <SortableContext items={skuArrField.fields.map((i) => i.id)}>
            {skuArrField.fields.map((field, idx) => {
              const curSku = field;
              const attInfo = curSku.skuAttributeValues
                .map(
                  (av) =>
                    `${
                      attAndAttValHash.attHash[av.productAttributeId]?.name
                    }: ${
                      attAndAttValHash.attValHash[av.productAttributeValueId]
                        ?.name
                    }`
                )
                .join(" - ");
              return (
                <Card variant="outlined" key={field.id} sx={{ marginTop: 1 }}>
                  <CardContent
                    sx={{ padding: "var(--mui-spacing) !important" }}
                  >
                    <SkuItem
                      form={form}
                      idx={idx}
                      attInfo={attInfo}
                      handleClickDeleteSku={handleClickDeleteSku}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </SortableContext>
        </DndContext>

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
      </FormControl>
    </>
  );
}
