"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OptionForm from "../_components/optionForm";
import { usePage } from "./usePage";

export default function OptionPage() {
  const { mutation, handleSetForm, handleClickSubmitForm } = usePage();

  return (
    <Box>
      <Typography variant="h4">Update Option</Typography>

      <Box
        component="form"
        noValidate
        sx={{ mt: 2 }}
        onSubmit={handleClickSubmitForm}
      >
        <OptionForm onGetForm={handleSetForm} />
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
