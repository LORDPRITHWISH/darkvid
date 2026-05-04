// import React from 'react'
import { Outlet } from "react-router";
import Sidelink from "../components/Sidelink";

const BaseLayout = () => {
  return (
    <>
      <Sidelink />
      <div className="w-screen min-h-screen text-white flex">
        {/* Main Content */}
        <div className="flex-1 ml-16">
          {/* the  ontent will render from here */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
