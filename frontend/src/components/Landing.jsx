import React from 'react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Landing = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-darkPlum text-white">
        <Outlet /> 
      </main>
      <LoginModal />
      <RegisterModal />
    </>
  );
}

export default Landing;