import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '../../../Assets/logo.jpg';
import Login from '../../Auth/Login';
import useNavigationStore from '../../../Stores/navigationStore';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '14ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));

export default function Navbar(props) {
  const { currentUser } = props;
  const matches = useMediaQuery('(min-width:900px)');

  const toggleDrawer = useNavigationStore((state) => state.toggleDrawer);

  const { displayName: fullName, photoURL: profilePic } = currentUser || {};

  const [anchorEl, setAnchorEl] = useState(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const navigate = useNavigate();

  // const toggleDrawer = (anchor, open) => (event) => {
  //   if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //     return;
  //   }

  //   setIsDrawerOpen({ ...isDrawerOpen, [anchor]: open });
  // };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  // const handleMobileMenuOpen = (event) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  // const menuId = 'primary-search-account-menu';
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: 'bottom',
  //       horizontal: 'right',
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     {/* <MenuItem onClick={handleMenuClose}>Logout</MenuItem> */}
  //     <MenuItem onClick={handleMenuClose}>
  //       <Logout />
  //     </MenuItem>
  //   </Menu>
  // );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  function renderCollegeNameOrNot() {
    return (!currentUser && !matches) || matches;
  }

  return (
    <Box sx={{ flexGrow: 1, marginBottom: '74px' }}>
      <AppBar position="absolute" style={{ margin: 0 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
            disabled={!currentUser}
          >
            <MenuIcon />
          </IconButton>
          {matches && (
            <Avatar
              style={{ marginRight: '10px', cursor: 'pointer' }}
              src={Logo}
              onClick={() => navigate('/Dashboard')}
            ></Avatar>
          )}
          <Typography
            align={matches ? 'left' : 'center'}
            variant="h6"
            noWrap
            component="p"
            onClick={() => navigate('/Dashboard')}
            sx={{
              display: {
                sm: 'block',
                color: '#ffc107',
                fontWeight: 600,
                flexGrow: matches ? 0 : 1,
                fontSize: matches ? '20px' : '18px',
                cursor: 'pointer',
              },
            }}
          >
            {renderCollegeNameOrNot() && 'Placement Cell'}
          </Typography>
          {currentUser && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search Jobs.." inputProps={{ 'aria-label': 'search' }} />
            </Search>
          )}
          {matches ? <Box sx={{ flexGrow: 1 }} /> : null}
          {currentUser && (
            <Box>
              <Avatar alt={currentUser.displayName} onClick={handleProfileMenuOpen} src={profilePic}>
                {currentUser.displayName.split(' ')[0].charAt(0)}
              </Avatar>
            </Box>
          )}
          {!currentUser && (
            <Box sx={{ display: { xs: 'flex' } }}>
              <Login />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {/* {renderMenu} */}
    </Box>
  );
}
