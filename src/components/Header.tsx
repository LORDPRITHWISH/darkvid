// import React from "react";
import { NavLink } from "react-router";
import { useUserStore } from "../store/userStore";

const Header = () => {
  const userId = useUserStore((s) => s.userId);
  const profilePhoto = useUserStore((s) => s.profilePhoto);

  return (
    <div className="bg-gray-800 flex h-fit ">
      <NavLink to="/app">
        <img src="https://i.postimg.cc/65Fws7vq/logo.png" alt="Dark Logo" className="h-20 w-20" />
      </NavLink>
      <div className="flex flex-col justify-between items-center text-center w-full">
        <h1 className="text-white text-2xl font-bold">Dark</h1>
        <nav className=" p-1">
          <NavLink to="/" className={({ isActive }) => `${isActive ? "text-2xl !text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold "} p-2`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `${isActive ? "text-2xl !text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold "} p-2 `}>
            About
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${isActive ? "text-2xl !text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold "} p-2 `
            }
          >
            login
          </NavLink>
          <NavLink
            to="/chanel"
            className={({ isActive }) =>
              `${isActive ? "text-2xl !text-red-600 font-extrabold" : "text-xl text-gray-300 font-bold "} p-2 `
            }
          >
            Chanel
          </NavLink>
        </nav>
      </div>
      <NavLink to="/chanel" className="ml-auto p-2">
        <img src={profilePhoto || "https://i.postimg.cc/65Fws7vq/logo.png"} alt={userId || "dark Avatar"} className="h-20 w-20 rounded-full" />
      </NavLink>
    </div>
  );
};

export default Header;