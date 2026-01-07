import React from 'react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-900 text-white">
        <Outlet /> 
      </main>
      <LoginModal />
      <RegisterModal />
    </>
  );
}

export default Layout;
