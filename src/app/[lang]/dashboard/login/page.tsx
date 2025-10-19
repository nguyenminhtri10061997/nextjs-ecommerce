"use client";
import AppTextFieldPassword from "@/components/customComponents/appTexFieldPassword";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { usePage } from "./usePage";

export default function Login() {
  const { errors, mutation, handleClickSubmit, register } = usePage();

  return (
    <div className="bg-white w-screen h-screen flex items-center justify-center">
      <Box
        component="form"
        noValidate
        sx={{ p: 2, width: 400 }}
        onSubmit={handleClickSubmit}
      >
        <TextField
          type="text"
          autoComplete="username"
          required
          fullWidth
          label="username"
          error={!!errors.username}
          helperText={errors.username?.message}
          margin="normal"
          {...register("username", { required: "username is required" })}
        />
        <AppTextFieldPassword
          autoComplete="password"
          required
          fullWidth
          label="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="normal"
          {...register("password", { required: "password is required" })}
        />
        <Button type="submit" variant="contained" loading={mutation.isPending}>
          Login
        </Button>
      </Box>
    </div>
  );
}
