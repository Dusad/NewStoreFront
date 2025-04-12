import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LeftSidebar from './LeftSidebar';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Card, CardContent, Typography, TextField
} from '@mui/material';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleRegisterSelect = (register) => {
    setSelectedRegister(register);
    setSearchTerm('');
    setFilteredItems(register.item);
  };

  // Debounce Search
  useEffect(() => {
    if (!selectedRegister?.item) return;

    const timeout = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const result = selectedRegister.item.filter((item) =>
        item.itemname.toLowerCase().includes(lower)
      );
      setFilteredItems(result);
    }, 300); // 300ms delay

    return () => clearTimeout(timeout);
  }, [searchTerm, selectedRegister]);

  // Highlight Match in Text
  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, `<mark class="bg-yellow-200 rounded">${term}</mark>`);
  };

  return (
    <div className="flex h-[calc(100vh-64px-56px)] overflow-hidden">
      {/* Sidebar Toggle */}
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
        } bg-indigo-900 text-white p-4 space-y-4 overflow-y-auto shadow-md transition-all duration-300 ${
          !isSidebarOpen ? 'hidden lg:block' : ''
        }`}
      >
        <LeftSidebar onRegisterSelect={handleRegisterSelect} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {selectedRegister ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Register Card */}
            <Card className="mb-6 shadow-md">
              <CardContent>
                <Typography variant="h5" component="h2" className="font-semibold text-indigo-800">
                  📘 Register Details
                </Typography>
                <div className="mt-4">
                  <Typography><strong>Register Name:</strong> {selectedRegister.rname}</Typography>
                  <Typography><strong>Register ID:</strong> {selectedRegister.id}</Typography>
                  <Typography><strong>Description:</strong> {selectedRegister.rdisc}</Typography>
                </div>
              </CardContent>
            </Card>

            {/* Search Input */}
            <div className="mb-4">
              <TextField
                label="🔍 Search Item"
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Items Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold">Item Name</TableCell>
                    <TableCell className="font-semibold">Item ID</TableCell>
                    <TableCell className="font-semibold">Page No</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-100 cursor-pointer">
                        <TableCell>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(item.itemname, searchTerm),
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.pageno}</TableCell>
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
          <div className="text-center text-xl text-gray-500">
            <p>Select a register to view its details.</p>
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="w-72 bg-white border-l border-gray-200 p-4 space-y-4 overflow-y-auto shadow-sm hidden md:block">
        <h2 className="text-lg font-semibold">🔔 Notifications</h2>
        <div className="bg-gray-50 p-3 rounded shadow">🔧 Maintenance at 9PM</div>
        <h2 className="text-lg font-semibold mt-4">📈 Stats</h2>
        <div className="bg-indigo-100 p-3 rounded shadow">120 Items in stock</div>
      </aside>
    </div>
  );
};

export default MainLayout;
