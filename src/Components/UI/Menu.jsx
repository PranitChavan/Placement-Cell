import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from 'material-ui-confirm';
import { applyHandler } from '../../Utils/applyHandler';
import { useAuth } from '../../Context/AuthContext';

const teacherOptions = ['View Applicants', 'Delete'];
const studentOptions = ['Apply', 'Delete My Application'];

const ITEM_HEIGHT = 48;

export default function MenuItems({ deletePost, postId, type }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const confirm = useConfirm();

  const confirmDeletion = () => {
    confirm({ description: 'Are you sure that you would like to delete this job post?', title: 'Delete Job Post' })
      .then(() => {
        deletePost(postId);
      })
      .catch(() => {});
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    switch (e.target.innerText) {
      case 'Delete':
        confirmDeletion();
        break;
      case 'View Applicants':
        navigate('/Applicants', { state: { postId } });
        break;
      case 'Apply':
        applyHandler(postId, currentUser);
      default:
        setAnchorEl(null);
    }
  };

  const decideItems = () => {
    return type === 'Teacher' ? teacherOptions : studentOptions;
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
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
