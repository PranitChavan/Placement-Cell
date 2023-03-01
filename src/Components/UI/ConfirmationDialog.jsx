import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useNavigationStore from '../../Stores/navigationStore';

export default function Confirmation() {
  const confirmationDialogState = useNavigationStore((state) => state.confirmationDialogState);
  const setAndToggleConfirmationDialog = useNavigationStore((state) => state.setAndToggleConfirmationDialog);

  function closeDialog() {
    setAndToggleConfirmationDialog({ ...confirmationDialogState, isOpen: false });
  }

  return (
    <>
      <Dialog
        fullWidth
        open={confirmationDialogState.isOpen}
        aria-labelledby="responsive-dialog-title"
        onClose={closeDialog}
      >
        <DialogTitle id="responsive-dialog-title"> {confirmationDialogState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmationDialogState.subTitle}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeDialog}>
            No
          </Button>
          <Button
            onClick={() => {
              confirmationDialogState.onConfirm();
              closeDialog();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
