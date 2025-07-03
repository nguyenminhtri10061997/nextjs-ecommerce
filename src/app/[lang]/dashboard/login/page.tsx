"use client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { usePage } from "./usePage";

export default function Login() {
  const {
    errors,
    showPassword,
    isLoading,
    handleTogglePassword,
    handleClickSubmit,
    register,
    handleSubmit,
  } = usePage();

  return (
    <div className="bg-white w-screen h-screen flex items-center justify-center">
      <Box
        component="form"
        noValidate
        sx={{ p: 2, width: 400 }}
        onSubmit={handleSubmit(handleClickSubmit)}
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
        <TextField
          type={showPassword ? "text" : "password"}
          autoComplete="password"
          required
          fullWidth
          label="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="normal"
          slotProps={{
            input: {
              label: "password",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register("password", { required: "password is required" })}
        />
        <Button type="submit" variant="contained" loading={isLoading}>
          Login
        </Button>
      </Box>
    </div>
  );
}
