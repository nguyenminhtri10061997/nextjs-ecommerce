import React, { useMemo, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import Image from "next/image";

export default function AppImageUpload() {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const url = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }
  }, [image]);

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="upload-image"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="upload-image">
        <Button variant="contained" color="primary" component="span">
          Upload Image
        </Button>
      </label>

      {url && (
        <Box mt={2}>
          <Typography variant="subtitle1">Preview:</Typography>
          <Image
            src={url}
            width={75}
            height={75}
            alt="Preview"
            style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
          />
        </Box>
      )}
    </Box>
  );
}
