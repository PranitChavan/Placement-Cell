import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import { Avatar } from '@mui/material';
import { hasStudentFilledTheForm } from '../../../Utils/helpers';
import { useQuery } from '@tanstack/react-query';
import { useAccountType } from '../../../Hooks/useAccountType';
import LogoutIcon from '@mui/icons-material/Logout';
import { app } from '../../../Config/firebaseCfg';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import useNavigationStore from '../../../Stores/navigationStore';

const auth = getAuth(app);

async function logoutHandler() {
  try {
    return await signOut(auth);
  } catch (err) {
    console.log(err);
  }
}

export default function Drawer({ currentUser }) {
  const [type] = useAccountType(currentUser);
  const navigate = useNavigate();
  const [accountType] = useAccountType(currentUser);
  const togglePostCreationForm = useNavigationStore((state) => state.togglePostCreationForm);

  const toggleDrawer = useNavigationStore((state) => state.toggleDrawer);
  const isDrawerOpen = useNavigationStore((state) => state.isDrawerOpen);

  const { displayName: fullName } = currentUser || {};

  const { data: formStatus } = useQuery({
    queryKey: ['formStatus'],
    queryFn: () => hasStudentFilledTheForm(currentUser),
    refetchOnWindowFocus: false,
    enabled: type === 'Student',
  });

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>{<Avatar> {fullName?.split(' ')[0].charAt(0)}</Avatar>}</ListItemIcon>
            <ListItemText primary={`Welcome ${fullName?.split(' ')[0]} !`} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider color="white" />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={'Profile'} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              type === 'Student' ? navigate('/StudentDetails') : (togglePostCreationForm(), navigate('/Dashboard'))
            }
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary={type === 'Student' ? (formStatus === 'FILLED' ? 'Update Form' : 'Fill Form') : 'Create Post'}
            />
          </ListItemButton>
        </ListItem>

        {accountType === 'Student' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/PlacedForm')}>
              <ListItemIcon>
                <CelebrationIcon />
              </ListItemIcon>
              <ListItemText primary={'Got the job?'} />
            </ListItemButton>
          </ListItem>
        )}

        {accountType === 'Teacher' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/PlacedStudents')}>
              <ListItemIcon>
                <RemoveRedEyeIcon />
              </ListItemIcon>
              <ListItemText primary={'View Placed Students'} />
            </ListItemButton>
          </ListItem>
        )}

        {accountType === 'Teacher' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/Students')}>
              <ListItemIcon>
                <SupervisedUserCircleIcon />
              </ListItemIcon>
              <ListItemText primary={'Students'} />
            </ListItemButton>
          </ListItem>
        )}

        {accountType === 'Student' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/appliedjobs')}>
              <ListItemIcon>
                <RemoveRedEyeIcon />
              </ListItemIcon>
              <ListItemText primary={'View Applied Jobs'} />
            </ListItemButton>
          </ListItem>
        )}

        <ListItem disablePadding>
          <ListItemButton onClick={() => logoutHandler()}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={'Sign Out'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <>
        <SwipeableDrawer anchor={'left'} open={isDrawerOpen} onClose={toggleDrawer} onOpen={toggleDrawer}>
          {list('left')}
        </SwipeableDrawer>
      </>
    </div>
  );
}
