import {
  ButtonProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import useIndex from "./useIndex";

type TProps = {
  titleModal?: string;
  contentModal?: string;
  okBtn?: string;
  cancelBtn?: string;
  isLoading?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  buttonProps?: ButtonProps;
};

export default function AppButtonConfirm(props: TProps) {
  const {
    titleModal = "Confirm",
    contentModal = "Are you sure?",
    okBtn = "Ok",
    cancelBtn = "Cancel",
    isLoading = false,
    buttonProps,
    children,
  } = props;
  const { isOpenConfirm, setIsOpenConfirm } = useIndex();

  return (
    <>
      <Button {...buttonProps} onClick={() => setIsOpenConfirm(true)}>
        {children}
      </Button>
      <Dialog open={isOpenConfirm}>
        <DialogTitle>{titleModal}</DialogTitle>
        <DialogContent dividers sx={{ width: 500 }}>
          {contentModal}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="outlined"
            onClick={() => {
              setIsOpenConfirm(false);
              props.onCancel?.();
            }}
            loading={isLoading}
          >
            {cancelBtn}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setIsOpenConfirm(false);
              props.onOk?.();
            }}
            loading={isLoading}
          >
            {okBtn}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
