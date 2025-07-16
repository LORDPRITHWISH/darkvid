// import React from "react";
import { NavLink } from "react-router";

const Header = () => {
  return (
    <div className="bg-gray-800 flex ">
      <NavLink to="/app">
        <img src="https://i.postimg.cc/65Fws7vq/logo.png" alt="Dark Logo" className="h-20 w-20" />
      </NavLink>
      <div className="flex flex-col justify-between items-center text-center w-full">
        <h1 className="text-white text-2xl font-bold">Dark</h1>
        <nav className=" p-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${isActive ? "text-2xl text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold ml-2 mr-2"} p-2 shadow-lg shadow-slate-900 rounded-xl`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${isActive ? "text-2xl text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold ml-2 mr-2"} p-2 shadow-lg shadow-slate-900 rounded-xl`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${isActive ? "text-2xl text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold ml-2 mr-2"} p-2 shadow-lg shadow-slate-900 rounded-xl`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/github"
            className={({ isActive }) =>
              `${isActive ? "text-2xl text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold ml-2 mr-2"} p-2 shadow-lg shadow-slate-900 rounded-xl`
            }
          >
            Github
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Header;