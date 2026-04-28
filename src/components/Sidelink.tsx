// import React from 'react'

import { NavLink } from "react-router";
import { quickLinks } from "@/utils/navLinks";

function Sidelink() {
  return (
    <div className="fixed left-0 top-0 h-screen w-16 mt-8 flex flex-col items-center py-4 z-30">
      {/* <h1 className="text-red-500 font-bold text-xs mb-6">DV</h1> */}
      <div className="flex flex-col gap-8 text-gray-400 mt-12 ml-4">
        {quickLinks.map(({ icon: Icon, activeIcon: ActiveIcon, label, link }) => (
          <NavLink key={label} className="hover:text-white cursor-pointer flex-col flex space-y-2 items-center justify-center text-gray-400" to={link}>
            {({ isActive }) => {
              const CurrentIcon = isActive ? ActiveIcon : Icon;
              return (
                <>
                  <CurrentIcon size={26} aria-label={label} className="mx-auto" />
                  <span className={`text-xs mx-auto ${isActive ? "text-white font-bold" : ""}`}>{label}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidelink;
