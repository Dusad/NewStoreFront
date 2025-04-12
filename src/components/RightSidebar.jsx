import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RightSidebar = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 p-4 shadow-sm hidden md:block">
        <h2 className="text-lg font-semibold">📊 Item Stats</h2>
        <div className="bg-indigo-50 p-3 rounded mt-4 text-gray-600">
          No item selected.
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
    <aside className="w-72 bg-white border-l border-gray-200 p-4 shadow-sm hidden md:block">
      <h2 className="text-lg font-semibold">📊 Item Stats</h2>
      
      {/* Graph Section */}
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="bg-indigo-100 p-3 rounded mt-4 text-gray-800 space-y-2">
        <p><strong>Item Name:</strong> {selectedItem.itemname}</p>
        <p><strong>Total Quantity:</strong> {totalQuantity}</p>
        <p><strong>Issued Quantity:</strong> {totalIssuedQuantity}</p>
        <p><strong>Issued Entries:</strong> {totalIssueEntries}</p>
        <p><strong>Available:</strong> {totalQuantity - totalIssuedQuantity}</p>
      </div>
    </aside>
  );
};

export default RightSidebar;
