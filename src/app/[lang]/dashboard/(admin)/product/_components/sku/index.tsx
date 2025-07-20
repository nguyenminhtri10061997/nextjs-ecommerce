import { handleNumberChange } from "@/common";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { ESkuStatus, EStockStatus, EStockType } from "@prisma/client";
import { Controller, UseFormReturn } from "react-hook-form";
import { TForm } from "../product-form/useIndex";
import useIndex from "./useIndex";
import React from "react";

type TProps = {
  idx: number;
  form: UseFormReturn<TForm>;
  isRenderStockType?: boolean;
  isRenderShippingInfo?: boolean;
  attInfo?: string;
};
export default React.memo(function Index(props: TProps) {
  const {
    form,
    idx,
    isRenderStockType = true,
    isRenderShippingInfo = true,
    attInfo,
  } = props;

  const { control } = form;
  const { stockTypeWatch } = useIndex({
    form,
    idx,
  });

  return (
    <>
      {attInfo}
      <Grid container gap={2} mt={1} wrap="wrap">
        <Grid size={1}>
          <Controller
            name={`skus.${idx}.sellerSku`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                label="Sku Code"
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ""}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              />
            )}
          />
        </Grid>
        {isRenderStockType && (
          <Grid size={2}>
            <Controller
              name={`skus.${idx}.stockType`}
              control={control}
              rules={{ required: "Stock Type is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  required
                  label="Stock Type"
                  select
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                >
                  <MenuItem key={EStockType.MANUAL} value={EStockType.MANUAL}>
                    {EStockType.MANUAL}
                  </MenuItem>
                  <MenuItem
                    key={EStockType.INVENTORY}
                    value={EStockType.INVENTORY}
                  >
                    {EStockType.INVENTORY}
                  </MenuItem>
                </TextField>
              )}
            />
          </Grid>
        )}
        {stockTypeWatch === "DIGITAL" && (
          <Grid size={2}>
            <Controller
              name={`skus.${idx}.downloadUrl`}
              control={control}
              rules={{ required: "DownloadUrl is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="DownloadUrl"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />
          </Grid>
        )}
        {stockTypeWatch === "MANUAL" && (
          <Grid size={3}>
            <Controller
              name={`skus.${idx}.stockStatus`}
              control={control}
              rules={{ required: "Stock Status is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  required
                  label="Stock Status"
                  select
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                >
                  {Object.values(EStockStatus).map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        )}
        {stockTypeWatch === "INVENTORY" && (
          <Grid size={1}>
            <Controller
              name={`skus.${idx}.stock`}
              control={control}
              rules={{ required: "Stock is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Stock"
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
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
        )}
        {isRenderShippingInfo && (
          <>
            <Grid size={1}>
              <Controller
                name={`skus.${idx}.weight`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Weight"
                    type="number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ""}
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

            <Grid size={1}>
              <Controller
                name={`skus.${idx}.width`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Width"
                    type="number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ""}
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

            <Grid size={1}>
              <Controller
                name={`skus.${idx}.length`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Length"
                    type="number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ""}
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

            <Grid size={1}>
              <Controller
                name={`skus.${idx}.height`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Height"
                    type="number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ""}
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
          </>
        )}
      </Grid>
      <Grid container gap={2} mt={1} wrap="wrap">
        <Grid size={7}>
          <Controller
            name={`skus.${idx}.note`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                label="Note"
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ""}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              />
            )}
          />
        </Grid>
        {isRenderShippingInfo && (
          <Grid size={2}>
            <Controller
              name={`skus.${idx}.isDefault`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label="Is Default"
                  control={
                    <Checkbox
                      checked={field.value ?? false}
                      onChange={field.onChange}
                    />
                  }
                />
              )}
            />
          </Grid>
        )}

        <Grid size={2.3}>
          <Controller
            name={`skus.${idx}.status`}
            control={control}
            rules={{ required: "status is required" }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                required
                label="status"
                select
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ""}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              >
                {Object.values(ESkuStatus).map((e) => (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </>
  );
});
