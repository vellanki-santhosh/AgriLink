import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/Layout';

// Pages
import Home from '@/pages/Home';
import Lands from '@/pages/Lands';
import Equipment from '@/pages/Equipment';
import Workers from '@/pages/Workers';
import Dashboard from '@/pages/Dashboard';
import Messages from '@/pages/Messages';
import Profile from '@/pages/Profile';
import Bookings from '@/pages/Bookings';
import Transport from '@/pages/Transport';
import Admin from '@/pages/Admin';
import CropCalendar from '@/pages/CropCalendar';
import Login from '@/pages/Login';
import SoilAnalysis from '@/pages/SoilAnalysis';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lands" element={<Lands />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/calendar" element={<CropCalendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/soil-analysis" element={<SoilAnalysis />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
