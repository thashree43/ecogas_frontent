import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from "../dash/Sidebarcomponent";
import ProductList from '../Productlistingpage';
import OrderList from '../Orderlistingagent';
import Saleslists from "../Saleslist"

const Dashboard: React.FC = () => {
  const agent = localStorage.getItem("agentInfo") || "Agent";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar toggle button for mobile */}
      <button 
        className="lg:hidden p-4 text-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 lg:ml-64">
        <header className="bg-white p-6 mb-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-700">Welcome, {agent}!</h1>
        </header>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="/company" element={<ProductList />} />
            <Route path='/orders' element={<OrderList/>}/>
            <Route path='/sales' element={<Saleslists/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-700 mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-semibold">Total Users</h3>
        <p className="text-3xl font-bold text-blue-500 mt-2">1,234</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-semibold">Active Brokers</h3>
        <p className="text-3xl font-bold text-blue-500 mt-2">56</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-semibold">Revenue</h3>
        <p className="text-3xl font-bold text-blue-500 mt-2">$12,345</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
