// src/components/ui/CustomTable.jsx
import React from 'react';

const CustomTable = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No items found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-indigo-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-indigo-900">Item Name</th>
            <th className="py-3 px-4 text-left font-semibold text-indigo-900">Item ID</th>
            <th className="py-3 px-4 text-left font-semibold text-indigo-900">Page No</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.id}
              className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50`}
            >
              <td className="py-3 px-4">{item.itemname}</td>
              <td className="py-3 px-4">{item.id}</td>
              <td className="py-3 px-4">{item.pageno}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
