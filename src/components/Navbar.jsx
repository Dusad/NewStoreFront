import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavButton = ({ children, onClick }) => (
  <Button
    onClick={onClick}
    className="!text-white !font-semibold hover:!text-yellow-300 transition-all duration-300"
  >
    {children}
  </Button>
);

function Navbar() {
  const navigate = useNavigate();

  // State for dropdowns
  const [anchorElRegister, setAnchorElRegister] = useState(null);
  const [anchorElItem, setAnchorElItem] = useState(null);

  return (
    <nav className="bg-indigo-800 px-6 py-3 flex space-x-6 shadow-md z-40 relative">
      {/* Dashboard */}
      <NavButton onClick={() => navigate('/')}>Dashboard</NavButton>

      {/* Register Dropdown */}
      <div>
        <NavButton onClick={(e) => setAnchorElRegister(e.currentTarget)}>Register ⌄</NavButton>
        <Menu
          anchorEl={anchorElRegister}
          open={Boolean(anchorElRegister)}
          onClose={() => setAnchorElRegister(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{
            className: 'bg-white text-gray-800 shadow-xl rounded-md border border-gray-200',
          }}
        >
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium transition-all"
            onClick={() => {
              navigate('/register/create');
              setAnchorElRegister(null);
            }}
          >
            ➕ Create Register
          </MenuItem>
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium transition-all"
            onClick={() => {
              navigate('/register/details');
              setAnchorElRegister(null);
            }}
          >
            📄 Register Details
          </MenuItem>
        </Menu>
      </div>

      {/* Item Dropdown */}
      <div>
        <NavButton onClick={(e) => setAnchorElItem(e.currentTarget)}>Item ⌄</NavButton>
        <Menu
          anchorEl={anchorElItem}
          open={Boolean(anchorElItem)}
          onClose={() => setAnchorElItem(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{
            className: 'bg-white text-gray-800 shadow-xl rounded-md border border-gray-200',
          }}
        >
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium transition-all"
            onClick={() => {
              navigate('/item/add');
              setAnchorElItem(null);
            }}
          >
            ➕ Add Item
          </MenuItem>
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium transition-all"
            onClick={() => {
              navigate('/item/detail');
              setAnchorElItem(null);
            }}
          >
            📋 Add Item Detail
          </MenuItem>
          <MenuItem
            className="hover:bg-indigo-100 hover:text-indigo-700 font-medium transition-all"
            onClick={() => {
              navigate('/item/issue-return');
              setAnchorElItem(null);
            }}
          >
            🔁 Issue/Return Item
          </MenuItem>
        </Menu>
      </div>

      {/* Reports */}
      <NavButton onClick={() => navigate('/reports')}>Reports</NavButton>

      {/* Settings */}
      <NavButton onClick={() => navigate('/settings')}>Settings</NavButton>
    </nav>
  );
}

export default Navbar;
