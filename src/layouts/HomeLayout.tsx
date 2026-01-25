// import React from 'react'
import { Outlet } from "react-router";
import Sidelink from "../components/Sidelink";


const HomeLayout = () => {
  return (
    <>
      <Sidelink />
      <Outlet />
    </>
  );
};

export default HomeLayout;
