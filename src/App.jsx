import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import MainLayout from './components/MainLayout';

// Pages for routing
import Dashboard from './pages/Dashboard';
import CreateRegister from './pages/CreateRegister';
import RegisterDetails from './pages/RegisterDetails';
import AddItem from './pages/AddItem';
import AddItemDetail from './pages/AddItemDetail';
import IssueReturnItem from './pages/IssueReturnItem';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import EditRegister from "./pages/EditRegister";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Top Header and Navbar */}
        <Header />
        <Navbar />

        {/* Main Routing Area */}
        <Routes>
          {/* Main layout wrapper for nested routes */}
          <Route path="/" element={<MainLayout />}>
            {/* Nested Routes inside MainLayout */}
            <Route index element={<Dashboard />} />
            <Route path="register/create" element={<CreateRegister />} />
            <Route path="register/details" element={<RegisterDetails />} />
            <Route path="item/add" element={<AddItem />} />
            <Route path="item/detail" element={<AddItemDetail />} />
            <Route path="item/issue-return" element={<IssueReturnItem />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/register/edit/:id" element={<EditRegister />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
