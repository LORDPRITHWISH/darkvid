// import React from 'react'
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex flex-col bg-[url('/darkvid_background.png')] bg-cover bg-accent bg-center min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
