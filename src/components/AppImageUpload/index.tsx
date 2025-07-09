import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Divider,
  IconButton,
  Modal,
  Stack,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import EmptyImage from "../../../public/empty-img.svg";

type TProps = {
  onChange?: (file: File) => void;
  onDelete?: (file?: File | null, url?: TProps['url']) => void
  file?: File | null;
  url?: string | null;
};

export default function AppImageUpload(props: TProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const theme = useTheme();
  const { url, file, onChange, onDelete } = props;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange?.(file);
    }
  };

  const handleClickDelete = () => {
    onDelete?.(file, url);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const imageUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    } else if (url) {
      return url;
    }
  }, [file, url]);

  return (
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
      <IconButton
        component="label"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <Image src={EmptyImage} alt="Uploaded Preview" width={50} height={50} />
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={handleImageChange}
        />
      </IconButton>
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            fill
            objectFit="contain"
            alt="empty-image"
            style={{
              backgroundColor: "white",
            }}
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
                width: "80vw",
                height: "80vh",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              {imageUrl && <Image src={imageUrl} alt="Uploaded Preview" fill />}
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
}
