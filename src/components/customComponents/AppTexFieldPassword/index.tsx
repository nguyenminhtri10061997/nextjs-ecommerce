'use client';

import {
  TextField,
  IconButton,
  InputAdornment,
  TextFieldProps,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useState } from 'react';

type Props = TextFieldProps;

export default function AppTextFieldPassword(props: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      {...props}
      slotProps={{
        input: {
          ...(props.slotProps?.input ?? {}),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((s) => !s)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            WebkitTextSecurity: showPassword ? 'none' : 'disc',
          }
        }
      }}
    />
  );
}
