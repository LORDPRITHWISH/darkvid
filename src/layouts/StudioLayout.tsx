// import React from 'react'
import { Outlet } from "react-router";
// import Header from "../components/Header";
import Footer from "../components/Footer";
// import Sidebar from "../components/Sidebar";
import StudioSidebar from "@/components/StudioSidebar";
// import Sidelink from './components/Sidelink'

const StudioLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-zinc-950 w-full overflow-clip">
        {/* <Sidelink /> */}
        <StudioSidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default StudioLayout;
