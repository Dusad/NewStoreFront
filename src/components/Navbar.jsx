import React, { useState } from 'react';
import { Button, Menu, MenuItem, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MenuBook, Settings, Dashboard, AddBox, ListAlt, AssignmentReturn, Storage } from '@mui/icons-material';

const NavButton = ({ children, onClick }) => (
  <Button
    onClick={onClick}
    className="!text-white !font-semibold hover:!text-yellow-300 hover:scale-105 transition-all duration-300 tracking-wide"
  >
    {children}
  </Button>
);

function Navbar() {
  const navigate = useNavigate();

  const [anchorElRegister, setAnchorElRegister] = useState(null);
  const [anchorElItem, setAnchorElItem] = useState(null);

  return (
    <nav className="bg-indigo-900 px-6 py-3 flex items-center space-x-6 shadow-xl z-40 relative border-b border-indigo-700">
      
      {/* Logo / Branding */}
      <div
        className="flex items-center space-x-2 cursor-pointer mr-6"
        onClick={() => navigate('/')}
      >
        <MenuBook className="text-yellow-400" />
        <h1 className="text-white text-xl font-bold tracking-wide">Store Manager</h1>
      </div>

      {/* Dashboard */}
      <NavButton onClick={() => navigate('/')}>
        <Dashboard className="mr-2" fontSize="small" />
        Dashboard
      </NavButton>

      {/* Register Dropdown */}
      <div>
        <NavButton onClick={(e) => setAnchorElRegister(e.currentTarget)}>
          <Storage className="mr-2" fontSize="small" />
          Register ⌄
        </NavButton>
        <Menu
          anchorEl={anchorElRegister}
          open={Boolean(anchorElRegister)}
          onClose={() => setAnchorElRegister(null)}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{
            className: 'bg-white text-gray-800 shadow-2xl rounded-md border border-gray-200',
          }}
        >
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium"
            onClick={() => {
              navigate('/register/create');
              setAnchorElRegister(null);
            }}
          >
            <AddBox className="text-indigo-500 mr-2" />
            Create Register
          </MenuItem>
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium"
            onClick={() => {
              navigate('/register/details');
              setAnchorElRegister(null);
            }}
          >
            <ListAlt className="text-indigo-500 mr-2" />
            Register Details
          </MenuItem>
        </Menu>
      </div>

      {/* Item Dropdown */}
      <div>
        <NavButton onClick={(e) => setAnchorElItem(e.currentTarget)}>
          <Storage className="mr-2" fontSize="small" />
          Item ⌄
        </NavButton>
        <Menu
          anchorEl={anchorElItem}
          open={Boolean(anchorElItem)}
          onClose={() => setAnchorElItem(null)}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{
            className: 'bg-white text-gray-800 shadow-2xl rounded-md border border-gray-200',
          }}
        >
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium"
            onClick={() => {
              navigate('/item/add');
              setAnchorElItem(null);
            }}
          >
            <AddBox className="text-indigo-500 mr-2" />
            Add Item
          </MenuItem>
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium"
            onClick={() => {
              navigate('/item/detail');
              setAnchorElItem(null);
            }}
          >
            <ListAlt className="text-indigo-500 mr-2" />
            Add Item Detail
          </MenuItem>
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium"
            onClick={() => {
              navigate('/item/issue-return');
              setAnchorElItem(null);
            }}
          >
            <AssignmentReturn className="text-indigo-500 mr-2" />
            Issue/Return Item
          </MenuItem>
        </Menu>
      </div>

      {/* Reports */}
      <NavButton onClick={() => navigate('/reports')}>
        <ListAlt className="mr-2" fontSize="small" />
        Reports
      </NavButton>

      {/* Settings */}
      <NavButton onClick={() => navigate('/settings')}>
        <Settings className="mr-2" fontSize="small" />
        Settings
      </NavButton>
    </nav>
  );
}

export default Navbar;
