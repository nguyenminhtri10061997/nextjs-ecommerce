"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BrandForm from "../_components/brandForm";
import { usePage } from "./usePage";

export default function BrandPage() {
  const {
    mutation,
    file,
    urlImg,
    handleSetForm,
    handleClickSubmitForm,
    handleChangeFile,
    handleDeleteFile,
  } = usePage();

  return (
    <Box>
      <Typography variant="h4">Update Brand</Typography>

      <Box
        component="form"
        noValidate
        sx={{ mt: 2 }}
        onSubmit={handleClickSubmitForm}
      >
        <BrandForm
          onGetForm={handleSetForm}
          file={file}
          onChangeFile={handleChangeFile}
          onDeleteFile={handleDeleteFile}
          logoUrl={urlImg}
        />
        <Stack direction={"row-reverse"}>
          <Button
            sx={{
              marginTop: 1,
            }}
            type="submit"
            variant="contained"
            loading={mutation.isPending}
          >
            Update
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
