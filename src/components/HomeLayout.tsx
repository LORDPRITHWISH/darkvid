// import React from 'react'
import { Outlet } from 'react-router'
import Sidelink from './Sidelink'
// import Header from './components/Header'
// import Footer from './components/Footer'
// import Sidebar from './components/Sidebar'
// import Sidelink from './components/Sidelink'



const HomeLayout = () => {
  return (
    <>
          <Sidelink />
          <Outlet />
    </>
  )
}

export default HomeLayout