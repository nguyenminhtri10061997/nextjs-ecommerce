"use client";

import { handleDragEnd, handleNumberChange, textToSlug } from "@/common/client";
import AppImageUpload from "@/components/customComponents/appImageUpload";
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
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Toolbar,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { EProductType } from "@prisma/client";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import DigitalFrom from "../digital-form";
import ProductOption from "../product-option";
import Service from "../service-form";
import SimpleForm from "../simple-form";
import VariableForm from "../variable-form";
import useIndex, { TForm } from "./useIndex";

type TProps = {
  onGetForm: (form: UseFormReturn<TForm>) => void;
};
export default function Index(props: TProps) {
  const { onGetForm } = props;
  const {
    form,
    queryBrand,
    queryCategory,
    queryOption,
    queryProductTag,
    listImageArrField,
    productTagArrField,
    productOptionArrField,
    productTagIdSelected,
    productOptionIdSelected,
    productTypeWatch,
  } = useIndex();

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
    onGetForm(form);
  }, [form, onGetForm]);

  useEffect(() => {
    const callbacks = [
      form.subscribe({
        name: "name",
        formState: {
          values: true,
        },
        callback: ({ values }) => {
          if (values.name) {
            form.setValue("slug", textToSlug(values.name));
          }
        },
      }),
      form.subscribe({
        name: "type",
        formState: {
          values: true,
        },
        callback: ({ values }) => {
          form.setValue("attributes", []);
          form.setValue("skus", []);
          const commonValSku = {
            price: 0,
            sellerSku: "",
            skuAttributeValues: [],
            status: "ACTIVE",
          };
          let setSku: Partial<TForm["skus"][number]> = {};
          switch (values.type) {
            case "SIMPLE":
              setSku = {
                stockType: "MANUAL",
                stockStatus: "STOCKING",
              };
              break;
            case "DIGITAL":
              setSku = {
                stockType: "DIGITAL",
              };
              break;
            case "VARIABLE":
              return;

            case "SERVICE":
              setSku = {
                stockType: "MANUAL",
              };
              break;
          }
          form.setValue("skus", [
            {
              ...commonValSku,
              ...setSku,
            },
          ] as TForm["skus"]);
        },
      }),
    ];

    return () => {
      callbacks.forEach((sub) => sub());
    };
  }, [form]);

  const renderProductTypeMap = {
    [EProductType.SIMPLE]: <SimpleForm form={form} />,
    [EProductType.VARIABLE]: <VariableForm form={form} />,
    [EProductType.DIGITAL]: <DigitalFrom form={form} />,
    [EProductType.SERVICE]: <Service form={form} />,
  };

  const { control } = form;

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="code"
            control={control}
            rules={{ required: "Code is required" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Code"
                fullWidth
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
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                fullWidth
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
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="slug"
            control={control}
            rules={{ required: "Slug is required" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Slug"
                fullWidth
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
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="seoTitle"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Seo Title"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || " "}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Description"
                multiline
                minRows={3}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || " "}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="seoDescription"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Seo Description"
                multiline
                minRows={3}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || " "}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="productCategoryId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Category"
                select
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || " "}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              >
                {queryCategory.isLoading ? (
                  <MenuItem disabled value="">
                    Loading...
                  </MenuItem>
                ) : (
                  queryCategory.data?.map((pc) => {
                    return (
                      <MenuItem key={pc.id} value={pc.id}>
                        {pc.name}
                      </MenuItem>
                    );
                  })
                )}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="brandId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Brand"
                select
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || " "}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              >
                {queryBrand.isLoading ? (
                  <MenuItem disabled value="">
                    Loading...
                  </MenuItem>
                ) : (
                  queryBrand.data?.map((pc) => {
                    return (
                      <MenuItem key={pc.id} value={pc.id}>
                        {pc.name}
                      </MenuItem>
                    );
                  })
                )}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="detail"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Detail"
                multiline
                minRows={3}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || " "}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              />
            )}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 2 }}>
          <Controller
            name="mainImage"
            control={control}
            rules={{ required: "Main image is required" }}
            render={({ field, fieldState }) => (
              <FormControl required>
                <FormLabel>Main Image</FormLabel>
                <AppImageUpload
                  file={field.value?.file}
                  url={form.getValues("mainImage")?.url}
                  onChange={(file: File) => {
                    field.onChange({ file });
                  }}
                  showDeleteBtn={false}
                  width={100}
                  height={100}
                />
                {fieldState.error && (
                  <FormHelperText error>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }}>
          <FormControl>
            <FormLabel>List Images</FormLabel>

            <Stack direction={"row"} gap={2} overflow={"auto"}>
              {listImageArrField.fields.map((item, idx) => (
                <Controller
                  key={item.id}
                  name={`listImages.${idx}.file`}
                  control={control}
                  render={({ field }) => (
                    <AppImageUpload
                      file={field.value}
                      url={form.getValues("listImages")?.[idx].url}
                      onChange={(file: File) => {
                        field.onChange({ file });
                      }}
                      onDelete={() => listImageArrField.remove(idx)}
                      width={100}
                      height={100}
                    />
                  )}
                />
              ))}
              <AppImageUpload
                onChange={(file) => listImageArrField.append({ file })}
                showDeleteBtn={false}
                width={100}
                height={100}
              />
            </Stack>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="viewCount"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="View Count"
                type="number"
                fullWidth
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
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="soldCount"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Sold Count"
                type="number"
                fullWidth
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
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}></Grid>
      </Grid>

      <Stack gap={1}>
        <FormControl>
          <FormLabel>Product Tag</FormLabel>
          {productTagArrField.fields.map((item, idx) => (
            <Grid key={item.id} container spacing={3} mt={1}>
              <Grid size="grow">
                <Controller
                  name={`productTags.${idx}.productTagId`}
                  control={control}
                  rules={{ required: "Tag is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Tag"
                      select
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                    >
                      {queryProductTag.isLoading ? (
                        <MenuItem disabled value="">
                          Loading...
                        </MenuItem>
                      ) : (
                        queryProductTag.data
                          ?.filter((op) => {
                            const found = productTagIdSelected.find(
                              (i) => i.productTagId === op.id
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
              </Grid>
              <Grid>
                <Controller
                  name={`productTags.${idx}.expiredAt`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Expired At"
                      type="datetime-local"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid>
                <IconButton onClick={() => productTagArrField.remove(idx)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Box mt={1}>
            <Button
              onClick={() =>
                productTagArrField.append({
                  productTagId: "",
                })
              }
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Tag
            </Button>
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Option</FormLabel>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd(
              form,
              "productOptions",
              productOptionArrField
            )}
          >
            <SortableContext
              items={productOptionArrField.fields.map((i) => i.id)}
            >
              {productOptionArrField.fields.map((field, idx) => (
                <ProductOption
                  productOptionIdSelected={productOptionIdSelected}
                  key={field.id}
                  idx={idx}
                  field={field}
                  queryOption={queryOption}
                  form={form}
                  productOptionArrField={productOptionArrField}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Toolbar disableGutters>
            <Button
              onClick={() =>
                productOptionArrField.append({
                  optionId: "",
                  maxSelect: null,
                  optionItems: [
                    {
                      optionItemId: "",
                      priceModifierType: "FREE",
                      priceModifierValue: 0,
                    },
                  ],
                })
              }
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Option
            </Button>
          </Toolbar>
        </FormControl>

        <Controller
          name="type"
          control={control}
          rules={{ required: "Type is required" }}
          render={({ field, fieldState }) => (
            <TextField
              required
              label="Type"
              select
              error={!!fieldState.error}
              helperText={fieldState.error?.message || " "}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
            >
              {Object.values(EProductType).map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {renderProductTypeMap[productTypeWatch]}

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="Is Active"
              control={
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                />
              }
            />
          )}
        />
      </Stack>
    </Box>
  );
}
