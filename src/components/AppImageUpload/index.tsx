import { getSignedUrl, uploadFileToS3ByGetSignedUrl } from "@/call-api/file";
import { calculateChecksumSHA256, slugifyFilename } from "@/common";
import { AppEnvironment } from "@/environment/appEnvironment";
import { useAlertContext } from "@/hooks/useAlertContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Stack,
  useTheme,
} from "@mui/material";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import EmptyImage from "../../../public/empty-img.svg";

type TProps = {
  onChange?: (file: File, key?: string | null) => void;
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
  isCallUploadWhenOnChange?: boolean;
  onUploading?: (isUploading: boolean) => void;
};

export default function AppImageUpload(props: TProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { showAlert } = useAlertContext();
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
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
    isCallUploadWhenOnChange,
    onUploading,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    let key;
    if (file) {
      if (file.size > AppEnvironment.MAX_FILE_SIZE_UPLOAD * 1024 * 1024) {
        showAlert(
          `Max file size is ${AppEnvironment.MAX_FILE_SIZE_UPLOAD}MB`,
          "error"
        );
        return;
      }
      if (isCallUploadWhenOnChange) {
        setLoading(true);
        onUploading?.(true);
        try {
          const checksum = await calculateChecksumSHA256(file);
          const res = await getSignedUrl({
            fileName: slugifyFilename(file.name),
            contentType: file.type,
            checksumSHA256: checksum,
          });

          await uploadFileToS3ByGetSignedUrl(res.signedUrl, file, checksum);
          key = res.key;
        } catch (err) {
          console.error(err);
          let mes = "An error occurred";
          if (err instanceof Error) {
            mes = err.message;
          }
          if (typeof err === "string") {
            mes = err;
          }
          if (err instanceof AxiosError) {
            mes = err.response?.data?.message || "An error occurred";
          }
          showAlert(mes, "error");
        }
      }
      setLoading(false);
      onUploading?.(false);
      onChange?.(file, key);
    }
    e.target.value = "";
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
      {loading && (
        <Box
          sx={{
            zIndex: 1,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
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
            sizes="100%"
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
