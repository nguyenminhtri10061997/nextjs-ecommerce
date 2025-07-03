'use client';

import UserForm from "@/app/[lang]/dashboard/(admin)/user/_components/UserForm";
import { Box, Button, Stack, Typography } from "@mui/material";
import usePage from "./usePage";

export default function Edit() {
    const { query, mutation, handleClickSubmit, handleSetForm, } = usePage()
    return (

        <Box>
            <Typography variant="h4">Update {query.data?.fullName}</Typography>

            <Box
                component="form"
                noValidate
                sx={{ mt: 2 }}
                onSubmit={handleClickSubmit}
            >

                <UserForm
                    onGetForm={handleSetForm}
                    isEdit
                />

                <Stack direction={'row-reverse'}>
                    <Button
                        loading={mutation.isPending}
                        sx={{
                            marginTop: 1,
                        }}
                        type="submit"
                        variant="contained"
                    >
                        Update
                    </Button>
                </Stack>
            </Box>

        </Box>
    );
}