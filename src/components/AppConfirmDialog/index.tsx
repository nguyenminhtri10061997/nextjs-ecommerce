import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { RefObject } from "react";

type TProps = {
    isOpen: boolean
    title?: string
    content?: string
    okBtn?: string
    cancelBtn?: string
    isLoading?: boolean
    onOk?: (isOkMany?: boolean) => void
    onCancel?: () => void
    isOkMany?: RefObject<boolean>
}

export default (props: TProps) => {
    const { isOpen, title = "Confirm", content = "Are you sure?", okBtn = "Ok", cancelBtn = "Cancel", isLoading = false } = props

    return (
        <Dialog
            open={isOpen}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers sx={{ width: 500 }}>
                {content}
            </DialogContent>
            <DialogActions>
                <Button autoFocus variant="outlined" onClick={props.onCancel} loading={isLoading}>
                    {cancelBtn}
                </Button>

                <Button variant="contained" onClick={() => props.onOk?.(props.isOkMany?.current)} loading={isLoading}>
                    {okBtn}
                </Button>
            </DialogActions>
        </Dialog>
    );
}