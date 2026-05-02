// import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
// import { useUserStore } from "../store/userStore";
import { useSidebarState } from "@/store/sideStore";
import { Menu, Search } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AvatarDropdown } from "./AvatarDropdown";
import { FaPlus } from "react-icons/fa6";

const Header = () => {

  const { toggle } = useSidebarState();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className=" flex px-2 bg-slate-950/30 top-0 sticky z-50 items-center justify-between backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="p-2 m-2 rounded-xl hover:bg-gray-700 transition">
          <Menu size={24} className="text-white" />
        </button>
        <NavLink to="/" className={"text-white flex items-center gap-1"}>
          <img src="/darkvid_logo.png" alt="Dark Logo" className="h-6 flex-shrink-0" />
          <span className="font-bold flex text-xl">DarkVids</span>
        </NavLink>
      </div>
      <div className="flex flex-col justify-between items-center text-center w-full max-w-xl mx-auto">
        <div className="relative w-full max-w-xl">
          <input type="text" placeholder="Search dark knowledge..." className="w-full rounded-full px-4 py-2 bg-zinc-900/70 text-sm focus:outline-none" />
          <Search className="absolute top-2.5 right-3 text-gray-400" size={20} />
        </div>
      </div>
      <div className="flex items-center gap-4 px-4">
        {location.pathname !== "/upload" && (
          <button
            className="text-white p-2 px-3 text-sm rounded-2xl bg-slate-800 hover:bg-slate-600 transition duration-200 flex items-center "
            onClick={() => navigate("/upload")}>
            <FaPlus className="mr-2 " size={20} />
            Create
          </button>
        )}
        <AvatarDropdown />
      </div>
    </div>
  );
};

export default Header;
