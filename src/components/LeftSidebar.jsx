import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LibraryBooks as LibraryBooksIcon } from '@mui/icons-material'; // Material UI Icon for book

const LeftSidebar = ({ onRegisterSelect }) => {
  const [registers, setRegisters] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/allregister')
      .then(response => {
        setRegisters(response.data);
      })
      .catch(error => {
        console.error('Error fetching registers:', error);
      });
  }, []);

  const handleRegisterClick = (register) => {
    onRegisterSelect(register);  // Pass the selected register to the parent component
  };

  return (
    <div className="w-64 bg-indigo-800 text-white p-6 space-y-4 overflow-y-auto shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <LibraryBooksIcon fontSize="large" /> 📚 Registers
      </h2>
      <ul className="space-y-4 text-sm">
        {registers.map(register => (
          <li
            key={register.id}
            className="hover:bg-indigo-700 hover:scale-105 transition-all duration-200 cursor-pointer p-2 rounded-lg"
            onClick={() => handleRegisterClick(register)}
          >
            <span className="font-medium">{register.rname}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;
