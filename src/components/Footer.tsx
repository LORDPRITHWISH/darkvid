// import React from "react";
import { NavLink } from "react-router";

const Footer = () => {
  return (
    <div className="bg-blue-900 w-full">
      <div className="flex flex-col justify-center items-center  p-5">
        <div className="flex justify-between items-around w-full">
          <div className="flex">
            <NavLink to="/github/lordprithwish" className="">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Portland_Pilots_P_logo%2C_purple_on_white.svg" alt="LORD GIT" className="h-10 w-10" />
            </NavLink>
            <NavLink to="/reddit" className="ml-4">
              <img src="https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Brand/Reddit_Logo.png?width=400&height=400&name=Reddit_Logo.png" alt="LORD GIT" className="h-10 w-10" />
            </NavLink>
          </div>
          <div className="flex">
            <a href="https://www.instagram.com/darknight999z/" target="_blank" rel="noreferrer" className="ml-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Github_logo_svg.svg" alt="Github" className="h-10 w-10" />
            </a>
            <a href="https://github.com/LORDPRITHWISH" target="_blank" rel="noreferrer" className="ml-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Insta" className="h-10 w-10" />
            </a>
          </div>
        </div>
        <p className="text-white text-lg font-bold">coyright @Dark</p>
      </div>
    </div>
  );
};

export default Footer;
