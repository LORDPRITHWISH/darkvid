// import React from 'react'

import { NavLink } from "react-router";
import { quickLinks } from "@/utils/navLinks";

function Sidelink() {
  return (
    <div className="fixed left-0 top-0 h-screen w-16 mt-16 flex flex-col items-center py-4 z-30">
      <div className="flex flex-col gap-6 text-gray-400 ml-4">
        {quickLinks.map(({ icon: Icon, activeIcon: ActiveIcon, label, link }) => (
          <NavLink key={label} className="hover:text-white cursor-pointer flex-col flex space-y-1 items-center justify-center text-gray-200" to={link}>
            {({ isActive }) => {
              const CurrentIcon = isActive ? ActiveIcon : Icon;
              return (
                <>
                  <CurrentIcon size={24} aria-label={label} className="mx-auto" />
                  <span className={`text-[10px] mx-auto ${isActive ? "text-white font-bold" : ""}`}>{label}</span>
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
