"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BrandForm from "../_components/language-form";
import { usePage } from "./usePage";

export default function Page() {
  const { query, mutation, handleSetForm, handleClickSubmitForm } = usePage();

  return (
    <Box>
      <Typography variant="h4">Update Language</Typography>

      <Box
        component="form"
        noValidate
        sx={{ mt: 2 }}
        onSubmit={handleClickSubmitForm}
      >
        <BrandForm onGetForm={handleSetForm} editRowId={query.data?.id} />
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
