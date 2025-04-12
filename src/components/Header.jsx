import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarehouseIcon from '@mui/icons-material/Warehouse';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
  className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg z-50"
    >
      <Toolbar className="flex justify-between">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center space-x-2">
          <WarehouseIcon className="text-white" fontSize="large" />
          <Typography
            variant="h6"
            component="div"
            className="font-bold tracking-wide text-white hover:scale-105 transition-transform duration-300"
          >
            Store Management System
          </Typography>
        </div>

        {/* Right Side: Notification + User */}
        <div className="flex items-center space-x-4">
          <Tooltip title="Notifications">
            <IconButton color="inherit" className="hover:scale-110 transition-transform">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account Settings">
            <IconButton onClick={handleAvatarClick} className="hover:scale-110 transition-transform">
              <Avatar alt="User" src="/user.png" />
            </IconButton>
          </Tooltip>

          {/* Avatar Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
