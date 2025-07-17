"use client";

import { handleNumberChange, textToSlug } from "@/common";
import { handleDragEnd } from "@/common/indexClient";
import AppImageUpload from "@/components/AppImageUpload";
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
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import AttributeItem from "../attribute";
import ProductOption from "../product-option";
import useIndex, { TForm } from "./useIndex";

type TProps = {
  onGetForm: (form: UseFormReturn<TForm>) => void;
};
export default function Index(props: TProps) {
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
    productAttArrField,
    queryAtt,
  } = useIndex();
  const { onGetForm } = props;

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
    const callback = form.subscribe({
      name: "name",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        if (values.name) {
          form.setValue("slug", textToSlug(values.name));
        }
      },
    });

    return () => callback();
  }, [form]);

  const { control } = form;

  return (
    <Stack direction={"column"} gap={2}>
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
              onChange={field.onChange}
              showDeleteBtn={false}
            />
            {fieldState.error && (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
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
                  onChange={field.onChange}
                  onDelete={() => listImageArrField.remove(idx)}
                />
              )}
            />
          ))}
          <AppImageUpload
            onChange={(file) => listImageArrField.append({ file })}
            showDeleteBtn={false}
          />
        </Stack>
      </FormControl>

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
            onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
          />
        )}
      />

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
            onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
          />
        )}
      />

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
            <Grid mt={1}>
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
              })
            }
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Option
          </Button>
        </Toolbar>
      </FormControl>

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
  );
}
