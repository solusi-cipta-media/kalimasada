import type { Breakpoint } from "@mui/material";
import { Dialog } from "@mui/material";

import DialogCloseButton from "./DialogCloseButton";

interface DialogProps {
  open?: boolean;
  maxWidth?: false | Breakpoint | undefined;
  fullWidth?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const CustomDialog = (props: DialogProps) => {
  const handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void = (e, reason) => {
    if (reason !== "backdropClick" && props.onClose) {
      props.onClose();
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='custom-dialog'
      maxWidth={props.maxWidth}
      fullWidth={props.fullWidth}
      open={props.open ?? false}
      PaperProps={{ sx: { overflow: "visible" } }}
    >
      <DialogCloseButton onClick={props.onClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      {props.children}
    </Dialog>
  );
};

export default CustomDialog;
