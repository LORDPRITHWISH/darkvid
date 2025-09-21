// import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useUserStore } from "../store/userStore";
import { useSidebarState } from "@/store/sideStore";
import { Menu, Search, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Header = () => {
  // const userId = useUserStore((s) => s.userId);
  const profilePhoto = useUserStore((s) => s.profilePhoto);
  const { toggle } = useSidebarState();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className=" flex p-1 bg-slate-950/30 top-0 sticky z-50 items-center justify-between backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="p-2 m-2 rounded-xl hover:bg-gray-700 transition">
          <Menu
            size={28}
            className="text-white"
          />
        </button>
        <NavLink
          to="/"
          className={"text-white flex items-center gap-1"}>
          <img
            src="/Darkvid.png"
            alt="Dark Logo"
            className="h-8 flex-shrink-0"
          />
          <span className="font-bold flex text-2xl">DarkVids</span>
        </NavLink>
      </div>
      <div className="flex flex-col justify-between items-center text-center w-full max-w-xl mx-auto">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search dark knowledge..."
            className="w-full rounded-full px-4 py-2 bg-zinc-900/70 text-sm focus:outline-none"
          />
          <Search
            className="absolute top-2.5 right-3 text-gray-400"
            size={18}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {location.pathname !== "/upload" && (
          <button
            className="text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-600 transition duration-200 flex items-center "
            onClick={() => navigate("/upload")}>
            <Upload className="mr-2" />
            upload
          </button>
        )}
        <NavLink
          to="/chanel"
          className="mr-4">
          <Avatar>
            <AvatarImage src={profilePhoto || "/profilepic.png"} />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
        </NavLink>
      </div>
    </div>
  );
};

export default Header;


