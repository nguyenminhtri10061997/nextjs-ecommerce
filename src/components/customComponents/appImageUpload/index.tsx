import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Divider,
  IconButton,
  Modal,
  Stack,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import EmptyImage from "../../../../public/empty-img.svg";

type TProps = {
  onChange?: (file: File) => void;
  onDelete?: (file?: File | null, url?: TProps["url"]) => void;
  file?: File | null;
  url?: string | null;
  /**
   * Is show delete button.
   * @default true
   */
  showDeleteBtn?: boolean;
  width?: number;
  height?: number;
  iconFontSize?: number;
};

export default function AppImageUpload(props: TProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const theme = useTheme();
  const {
    url,
    file,
    onChange,
    onDelete,
    showDeleteBtn = true,
    width = 150,
    height = 150,
    iconFontSize = 20,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange?.(file);
      e.target.value = "";
    }
  };

  const handleClickDelete = () => {
    onDelete?.(file, url);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setTimeout(() => {
      setHover(false);
    }, 200);
  };
  const handleCloseModal = () => setModalOpen(false);

  const imageUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    } else if (url) {
      return url;
    }
  }, [file, url]);

  const handleClickEdit = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      sx={{
        position: "relative",
        width,
        height,
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        border: "1px dashed gray",
        flexShrink: 0,
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
          ref={inputRef}
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
            alt="empty-image"
            style={{
              backgroundColor: "white",
              objectFit: "contain",
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
              <IconButton onClick={handleClickEdit} size="small">
                <EditIcon sx={{ fontSize: iconFontSize }} />
              </IconButton>
              <Divider orientation="vertical" variant="middle" flexItem />
              <IconButton onClick={handleOpenModal} size="small">
                <VisibilityIcon sx={{ fontSize: iconFontSize }} />
              </IconButton>
              <Divider orientation="vertical" variant="middle" flexItem />
              {showDeleteBtn && (
                <IconButton onClick={handleClickDelete} size="small">
                  <DeleteIcon sx={{ fontSize: iconFontSize }} />
                </IconButton>
              )}
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
