import React from 'react'
import Navbar from '../navbar/Navbar'
import { Outlet } from 'react-router-dom'
const Landing =()=> {
  return(
    <>
        <Navbar/>,
        <main className="min-h-screen bg-darkPlum text-white">
            <Outlet />
        </main>
        
    </>
  )
}

export default Landing