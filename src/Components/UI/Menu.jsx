import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const teacherOptions = ['View Applicants', 'Delete'];
const studentOptions = ['Apply', 'Delete My Application'];

const ITEM_HEIGHT = 48;

export default function MenuItems({
  deletePost,
  postId,
  type,
  hasStudentApplied,
  apply,
  deleteJobApplication,
  setConfirmDialog,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (e) => {
    const option = e.target.innerText;
    setAnchorEl(null);

    switch (option) {
      case 'Delete': {
        setConfirmDialog({
          isOpen: true,
          title: 'Delete Job Post',
          subTitle: 'Are you sure that you would like to delete this job post?',
          onConfirm: () => {
            deletePost(postId);
          },
        });

        break;
      }
      case 'View Applicants':
        navigate(`/Applicants/${postId}`, { state: { postId } });
        break;
      case 'Apply':
        apply(postId);
        break;
      case 'Delete My Application':
        setConfirmDialog({
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
