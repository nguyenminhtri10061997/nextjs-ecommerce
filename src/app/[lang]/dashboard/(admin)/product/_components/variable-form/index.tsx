import { handleDragEnd } from "@/common/indexClient";
import AppButtonConfirm from "@/components/AppButtonConfirm";
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
import { Button, FormControl, FormLabel, Toolbar } from "@mui/material";
import { startTransition, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { v4 } from "uuid";
import AttributeItem from "../attribute";
import { TForm } from "../product-form/useIndex";
import SkuVariableForm from "../sku-variable-form";
import useIndex, { TAttValHash } from "./useIndex";

type TProps = {
  form: UseFormReturn<TForm>;
};
export default function Index(props: TProps) {
  const { form } = props;

  const {
    queryAtt,
    productAttArrField,
    skuArrField,
    // attAndAttValHash,
    attAndAttValHashDeferred,
    setAttAndAttValHash,
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

  useEffect(() => {
    const callback = form.subscribe({
      name: "attributes",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        startTransition(() => {
          const res: TAttValHash = {
            attHash: {},
            attValHash: {},
          };
          values.attributes.forEach((att) => {
            res.attHash[att.id!] = att;
            att.attributeValues?.forEach((attV) => {
              res.attValHash[attV.id!] = attV;
            });
          });
          setAttAndAttValHash(res);
        });
      },
    });

    return () => callback();
  }, [form, setAttAndAttValHash]);

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
                type: "RADIO",
                attributeValues: [
                  {
                    id: v4(),
                    image: {
                      file: null,
                      url: null,
                    },
                    name: "",
                    slug: "",
                    status: "ACTIVE",
                  },
                ],
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
              return (
                <SkuVariableForm
                  key={field.id}
                  attAndAttValHashDeferred={attAndAttValHashDeferred}
                  form={form}
                  idx={idx}
                  handleClickDeleteSku={handleClickDeleteSku}
                />
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
