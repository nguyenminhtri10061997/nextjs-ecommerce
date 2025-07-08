import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { useMemo, useState } from "react";

type TProps = {
  onChange?: (file: File) => void;
  onDelete?: (file: File) => void;
  file?: File | null;
};

export default function AppImageUpload(props: TProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const theme = useTheme();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      props.onChange?.(file);
    }
  };

  const handleClickDelete = () => {
    props.onDelete?.(props.file!);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const imageUrl = useMemo(() => {
    if (props.file) {
      return URL.createObjectURL(props.file);
    }
  }, [props.file]);

  return (
    <>
      <Box>
        <Button variant="contained" component="label">
          Pick Image
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: 150,
          height: 150,
          borderRadius: 2,
          overflow: "hidden",
          cursor: "pointer",
          border: "1px dashed gray",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {!!props.file && (
          <>
            <Avatar
              src={imageUrl}
              variant="rounded"
              sx={{ width: "100%", height: "100%" }}
            />
            {hover && (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                position="absolute"
                bgcolor={theme.vars?.palette.Chip.defaultBorder}
                top="50%"
                left="50%"
                borderRadius={20}
                sx={{
                  transform: "translate(-50%, -50%)",
                }}
              >
                <IconButton onClick={handleOpenModal}>
                  <VisibilityIcon />
                </IconButton>
                <Divider orientation="vertical" variant="middle" flexItem />
                <IconButton onClick={handleClickDelete}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            )}
            <Modal open={modalOpen} onClose={handleCloseModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  borderRadius: 2,
                  p: 2,
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  overflow: "auto",
                }}
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Uploaded Preview"
                    width={800}
                    height={800}
                  />
                )}
              </Box>
            </Modal>
          </>
        )}
      </Box>
    </>
  );
}
