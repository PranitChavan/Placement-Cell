import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useAuth } from '../../Context/AuthContext';
import useNavigationStore from '../../Stores/navigationStore';

const teacherOptions = ['Delete Post'];
const studentOptions = ['Delete My Application'];

const ITEM_HEIGHT = 48;

export default function MenuItems({ deletePost, postId, type, hasStudentApplied, deleteJobApplication }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useAuth();
  const setAndToggleConfirmationDialog = useNavigationStore((state) => state.setAndToggleConfirmationDialog);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (e) => {
    const option = e.target.innerText;
    setAnchorEl(null);

    switch (option) {
      case 'Delete Post': {
        setAndToggleConfirmationDialog({
          isOpen: true,
          title: 'Delete Job Post',
          subTitle: 'Are you sure that you would like to delete this job post?',
          onConfirm: () => deletePost(postId),
        });

        break;
      }

      case 'Delete My Application':
        setAndToggleConfirmationDialog({
          isOpen: true,
          title: 'Delete Application',
          subTitle: 'Are you sure that you would like to delete your application? You can always apply again.',
          onConfirm: () => {
            deleteJobApplication([currentUser.uid, postId]);
          },
        });

        break;
      default:
        break;
    }
  };

  const decideItems = () => {
    return type === 'Teacher' ? teacherOptions : studentOptions;
  };

  const disableMenuItems = (option) => {
    if (option === 'Apply' && hasStudentApplied) return true;
    if (option === 'Delete My Application' && !hasStudentApplied) return true;

    return false;
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        style={{ marginTop: '5px' }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '21ch',
          },
        }}
      >
        {decideItems().map((option) => (
          <MenuItem key={option} onClick={handleClose} disabled={disableMenuItems(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
