import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RightSidebar = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <aside className="w-72 bg-gradient-to-t from-indigo-100 via-indigo-200 to-indigo-300 border-l border-gray-200 p-6 shadow-xl rounded-lg hidden md:block">
        <h2 className="text-xl font-semibold text-indigo-800">📊 Item Stats</h2>
        <div className="bg-indigo-50 p-4 rounded mt-4 text-gray-600">
          <p className="text-center">No item selected.</p>
        </div>
      </aside>
    );
  }

  let totalQuantity = 0;
  let totalIssuedQuantity = 0;
  let totalIssueEntries = 0;

  selectedItem.itemdetail?.forEach(detail => {
    totalQuantity += detail.itemquantity || 0;
    totalIssuedQuantity += detail.issuedquantity || 0;
    totalIssueEntries += detail.itemissue?.length || 0;
  });

  // Graph data
  const graphData = [
    { name: 'Total Quantity', value: totalQuantity },
    { name: 'Issued Quantity', value: totalIssuedQuantity },
    { name: 'Available Quantity', value: totalQuantity - totalIssuedQuantity }
  ];

  return (
    <aside className="w-72 bg-gradient-to-t from-indigo-100 via-indigo-200 to-indigo-300 border-l border-gray-200 p-6 shadow-xl rounded-lg hidden md:block">
      <h2 className="text-xl font-semibold text-indigo-800">📊 Item Stats</h2>
      
      {/* Graph Section */}
      <div className="mt-6 h-48 rounded-lg shadow-lg p-4 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
            <YAxis tick={{ fill: '#4B5563' }} />
            <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Bar dataKey="value" fill="#6C63FF" barSize={30} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Section */}
      <div className="bg-white p-4 rounded-lg mt-6 shadow-lg space-y-3">
        <p className="text-lg font-medium text-indigo-800">
          <strong>Item Name:</strong> {selectedItem.itemname}
        </p>
        <p className="text-gray-700">
          <strong>Total Quantity:</strong> <span className="text-indigo-600">{totalQuantity}</span>
        </p>
        <p className="text-gray-700">
          <strong>Issued Quantity:</strong> <span className="text-indigo-600">{totalIssuedQuantity}</span>
        </p>
        <p className="text-gray-700">
          <strong>Issued Entries:</strong> <span className="text-indigo-600">{totalIssueEntries}</span>
        </p>
        <p className="text-gray-700">
          <strong>Available:</strong> <span className="text-indigo-600">{totalQuantity - totalIssuedQuantity}</span>
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
