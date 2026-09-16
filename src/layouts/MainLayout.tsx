import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-gray-100 selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

