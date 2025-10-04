// import React from 'react'
import { Outlet } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Setdata from './components/Setdata'
// import Sidelink from './components/Sidelink'



const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <Setdata />
        <div className="flex-grow bg-slate-950 w-full overflow-clip">
          {/* <Sidelink /> */}
          <Outlet />
          <Sidebar />
        </div>
        <Footer />
    </div>
  )
}

export default Layout