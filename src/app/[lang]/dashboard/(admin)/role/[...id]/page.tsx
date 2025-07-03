'use client';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RoleForm from "../_components/RoleForm";
import { usePage } from "./usePage";

export default () => {
    const {
        mutation,
        permissionSelected,
        handleSetForm,
        handleClickSubmit,
        handleChangeCheckbox,
    } = usePage()

    return (
        <Box>
            <Typography variant="h4">Update Role</Typography>

            <Box
                component="form"
                noValidate
                sx={{ mt: 2 }}
                onSubmit={handleClickSubmit}
            >
                <RoleForm
                    onGetForm={handleSetForm}
                    permissionSelected={permissionSelected}
                    handleChangeCheckbox={handleChangeCheckbox}
                />
                <Stack direction={'row-reverse'}>
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