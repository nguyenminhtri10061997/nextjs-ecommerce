"use client"

import UserForm from "@/app/[lang]/dashboard/(admin)/user/create/_components/UserForm"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { usePage } from "./usePage"

export default function CreatePage() {
  const { mutation, handleSetForm, handleClickSubmitForm } = usePage()

  return (
    <Box>
      <Typography variant="h4">Create User</Typography>

      <Box
        component="form"
        noValidate
        sx={{ mt: 2 }}
        onSubmit={handleClickSubmitForm}
      >
        <UserForm onGetForm={handleSetForm} />

        <Stack direction={"row-reverse"}>
          <Button
            sx={{
              marginTop: 1,
            }}
            type="submit"
            variant="contained"
            loading={mutation.isPending}
          >
            Create
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
