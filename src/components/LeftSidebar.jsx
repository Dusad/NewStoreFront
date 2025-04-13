import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LibraryBooks as LibraryBooksIcon } from '@mui/icons-material'; // Material UI Icon for book
import { FaChevronRight } from 'react-icons/fa'; // Chevron icon for expanding items
import { Search } from '@mui/icons-material'; // Material UI Search Icon

const LeftSidebar = ({ onRegisterSelect }) => {
  const [registers, setRegisters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegisters, setFilteredRegisters] = useState([]);
  const [activeRegister, setActiveRegister] = useState(null); // To track the active register

  useEffect(() => {
    axios.get('http://localhost:8080/allregister')
      .then(response => {
        setRegisters(response.data);
        setFilteredRegisters(response.data); // Initial filter to show all registers
      })
      .catch(error => {
        console.error('Error fetching registers:', error);
      });
  }, []);

  useEffect(() => {
    const result = registers.filter(register =>
      register.rname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegisters(result);
  }, [searchTerm, registers]);

  const handleRegisterClick = (register) => {
    setActiveRegister(register.id); // Set active register
    onRegisterSelect(register);  // Pass the selected register to the parent component
  };

  return (
    <div className="w-72 bg-gradient-to-r from-indigo-800 to-indigo-900 text-white p-6 space-y-6 overflow-y-auto shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <LibraryBooksIcon fontSize="large" />
        <span className="tracking-wide">📚 Registers</span>
      </h2>

      {/* Search Box */}
      <div className="flex items-center bg-indigo-700 p-2 rounded-lg">
        <Search className="text-gray-300" />
        <input
          type="text"
          className="bg-indigo-700 text-white p-2 ml-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Search Registers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Registers List */}
      <ul className="space-y-4 mt-6">
        {filteredRegisters.map(register => (
          <li
            key={register.id}
            className={`group p-3 rounded-lg flex justify-between items-center transition-all duration-300 cursor-pointer 
              ${activeRegister === register.id ? 'bg-indigo-600 scale-105 shadow-xl' : 'hover:bg-indigo-700 hover:scale-105'}`}
            onClick={() => handleRegisterClick(register)}
          >
            <span className="font-medium text-lg">{register.rname}</span>
            <FaChevronRight className={`text-gray-400 group-hover:text-white transition-all duration-200 ${activeRegister === register.id ? 'text-white' : ''}`} />
          </li>
        ))}
        {filteredRegisters.length === 0 && (
          <li className="text-center text-gray-400">No Registers Found</li>
        )}
      </ul>
    </div>
  );
};

export default LeftSidebar;
