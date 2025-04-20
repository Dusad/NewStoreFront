import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Card, CardContent, Typography, TextField, Divider, Button
} from '@mui/material';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegisterSelect = (register) => {
    setSelectedRegister(register);
    setSelectedItem(null);
    setSearchTerm('');
    setFilteredItems(register.item);
    navigate('/');
  };

  useEffect(() => {
    if (!selectedRegister?.item) return;
    const timeout = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const result = selectedRegister.item.filter((item) =>
        item.itemname.toLowerCase().includes(lower) ||
        item.id.toString().includes(lower) ||
        item.pageno.toLowerCase().includes(lower)
      );
      setFilteredItems(result);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedRegister]);

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, `<mark class="bg-yellow-300 rounded">$1</mark>`);
  };

  const isRegisterPage = location.pathname === '/';

  return (
    <div className="flex h-[calc(100vh-64px-56px)] overflow-hidden bg-gray-100">
      {/* Toggle Button */}
      <button
        className="absolute top-2 left-2 z-50 bg-indigo-800 text-white p-2 rounded-md lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Left Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-64'
        } bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-4 space-y-4 overflow-y-auto shadow-lg transition-all duration-300 ease-in-out ${
          !isSidebarOpen ? 'hidden lg:block' : ''
        }`}
      >
        <LeftSidebar onRegisterSelect={handleRegisterSelect} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto shadow-lg rounded-lg mx-4">
        <Outlet />

        {isRegisterPage ? (
          selectedRegister ? (
            <div className="space-y-6">
              <Card elevation={6} className="rounded-lg shadow-xl transition-transform hover:scale-105 duration-300">
                <CardContent className="space-y-2">
                  <Typography variant="h5" className="text-indigo-700 font-semibold">
                    📘 {selectedRegister.rname}
                  </Typography>
                  <Divider />
                  <Typography className="text-gray-700">
                    <strong>ID:</strong> {selectedRegister.id}
                  </Typography>
                  <Typography className="text-gray-700">
                    <strong>Description:</strong> {selectedRegister.rdisc}
                  </Typography>
                </CardContent>
              </Card>

              <TextField
                label="🔍 Search by Name, ID or Page No."
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white rounded shadow-md mt-4"
              />

              <TableContainer component={Paper} className="rounded-lg shadow-lg mt-6">
                <Table>
                  <TableHead>
                    <TableRow className="bg-indigo-100">
                      <TableCell className="font-semibold">📦 Item Name</TableCell>
                      <TableCell className="font-semibold">🆔 Item ID</TableCell>
                      <TableCell className="font-semibold">📄 Page No</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow
                          key={item.id}
                          className={`hover:bg-indigo-100 cursor-pointer transition duration-200 ease-in-out ${
                            selectedItem?.id === item.id ? 'bg-indigo-200' : ''
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <TableCell>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(item.itemname, searchTerm),
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.pageno.join(',')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No matching items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="text-center text-xl text-gray-500 mt-32">
              📚 Select a register to view its details.
            </div>
          )
        ) : null}
      </main>

      {/* Right Sidebar */}
      <RightSidebar selectedRegister={selectedRegister} selectedItem={selectedItem} />
    </div>
  );
};

export default MainLayout;
