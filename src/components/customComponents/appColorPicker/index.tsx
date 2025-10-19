import { alphaToHex } from "@/common/client";
import { Button, DialogActions, Popover } from "@mui/material";
import React, { useState, useTransition } from "react";
import { ChromePicker, ColorResult } from "react-color";

type Props = {
  value: string;
  titleBtn?: string;
  width?: number;
  height?: number;
  onChange: (color: string) => void;
};

const AppColorPicker: React.FC<Props> = ({
  value,
  titleBtn,
  width,
  height,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [color, setColor] = useState<string>(value);
  const startTransition = useTransition()[1];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color: ColorResult) => {
    startTransition(() => {
      setColor(`${color.hex}${alphaToHex(color.rgb.a)}`);
    });
  };

  const handleClickOk = () => {
    onChange(color!);
    handleClose();
  };

  const handleReset = () => {
    setColor(value);
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-popover" : undefined;
  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ backgroundColor: value, width, height }}
      >
        {titleBtn}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ChromePicker
          color={color}
          onChange={handleColorChange}
          styles={{
            default: {
              picker: {
                boxShadow: "none",
              },
            },
          }}
        />
        <DialogActions>
          <Button onClick={handleReset} color="info">
            Reset
          </Button>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
          <Button onClick={handleClickOk}>Ok</Button>
        </DialogActions>
      </Popover>
    </>
  );
};

export default AppColorPicker;
