import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import MainLayout from './components/MainLayout';

// Pages Import
import Dashboard from './pages/Dashboard';
import CreateRegister from './pages/CreateRegister';
import RegisterDetails from './pages/RegisterDetails';
import AddItem from './pages/AddItem';
import AddItemDetail from './pages/AddItemDetail';
import IssueReturnItem from './pages/IssueReturnItem';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <MainLayout>
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register/create" element={<CreateRegister />} />
            <Route path="/register/details" element={<RegisterDetails />} />
            <Route path="/item/add" element={<AddItem />} />
            <Route path="/item/detail" element={<AddItemDetail />} />
            <Route path="/item/issue-return" element={<IssueReturnItem />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;
