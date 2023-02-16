import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Confirmation(props) {
  const { confirmDialog, setConfirmDialog } = props;

  return (
    <div>
      <Dialog
        fullWidth
        open={confirmDialog.isOpen}
        aria-labelledby="responsive-dialog-title"
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      >
        <DialogTitle id="responsive-dialog-title"> {confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.subTitle}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
            No
          </Button>
          <Button onClick={confirmDialog.onConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
