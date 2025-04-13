import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LibraryBooks as LibraryBooksIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { FaChevronRight } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeftSidebar = ({ onRegisterSelect }) => {
  const [registers, setRegisters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegisters, setFilteredRegisters] = useState([]);
  const [activeRegister, setActiveRegister] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRegisters = () => {
    setIsRefreshing(true);
    axios.get('http://localhost:8080/allregister')
      .then(response => {
        setRegisters(response.data);
        setFilteredRegisters(response.data);
        toast.success("Registers refreshed successfully!");
      })
      .catch(error => {
        console.error('Error fetching registers:', error);
        toast.error("Failed to refresh registers.");
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchRegisters();
  }, []);

  useEffect(() => {
    const result = registers.filter(register =>
      register.rname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegisters(result);
  }, [searchTerm, registers]);

  const handleRegisterClick = (register) => {
    setActiveRegister(register.id);
    onRegisterSelect(register);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-indigo-900 text-white p-6 space-y-6 overflow-y-auto shadow-2xl rounded-r-3xl transition-all duration-500 relative">
      
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-2xl font-semibold text-white">
          <LibraryBooksIcon fontSize="large" />
          <span className="tracking-wide">Registers</span>
        </div>
        {isRefreshing ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          <RefreshIcon
            onClick={fetchRegisters}
            className="cursor-pointer text-indigo-200 hover:text-white transition"
            titleAccess="Refresh Registers"
          />
        )}
      </div>

      {/* Search Box */}
      <div className="flex items-center bg-indigo-700/60 hover:bg-indigo-700 transition-colors duration-300 px-3 py-2 rounded-xl">
        <SearchIcon className="text-indigo-200" />
        <input
          type="text"
          className="bg-transparent text-white w-full ml-3 placeholder-indigo-300 focus:outline-none"
          placeholder="Search Registers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Registers List */}
      <ul className="space-y-1 mt-2">
        {filteredRegisters.map(register => (
          <li
            key={register.id}
            onClick={() => handleRegisterClick(register)}
            className={`
              group flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-300
              ${activeRegister === register.id
                ? 'bg-indigo-600 scale-[1.03] shadow-xl ring-2 ring-white/20'
                : 'hover:bg-indigo-700 hover:scale-[1.02]'}
            `}
          >
            <span className="text-lg font-medium truncate">{register.rname}</span>
            <FaChevronRight
              className={`
                text-indigo-300 group-hover:text-white transition duration-200
                ${activeRegister === register.id ? 'text-white rotate-90' : ''}
              `}
            />
          </li>
        ))}
        {filteredRegisters.length === 0 && (
          <li className="text-center text-indigo-300 italic">No Registers Found</li>
        )}
      </ul>
    </div>
  );
};

export default LeftSidebar;
