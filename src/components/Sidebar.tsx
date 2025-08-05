// import { useState } from "react";
import { X, Home, Upload, Users, Star } from "lucide-react";
import { useSidebarState } from "@/store/sideStore";
import { useNavigate } from "react-router";
// import { link } from "fs";

const navItems = [
  { icon: Home, label: "Home" ,link: ""},
  { icon: Users, label: "Subscribed", link: "subscribed" },
  { icon: Upload, label: "Upload", link: "upload" },
  { icon: Star, label: "Top Channels", link: "top-channels" },
];

export default function Sidebar() {
  // const [open, setOpen] = useState(false);
  const { open, toggle } = useSidebarState();
  const navigate = useNavigate();

  return (
    <>
      {/* Toggle Button */}
      {/* <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition"
      >
        <Menu size={24} className="text-white" />
      </button> */}

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        // onClick={() => setOpen(false)}
        onClick={toggle}
      />

      {/* Sidebar Panel */}
      <aside
        className={`absolute top-0 left-0 z-50 h-full bg-slate-950 w-64 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center p-1 ">
          <button onClick={toggle} className="text-white p-2 m-2 hover:bg-gray-700 rounded-xl">
            <X size={28} className="text-white" />
          </button>
          <div className="flex items-center gap-1">
            <img src="/Darkvid.png" alt="logo" className="h-8" />
            <h1 className="text-2xl font-semibold text-white">DarkVids</h1>
          </div>
        </div>

        <nav className="mt-4 px-4 flex flex-col gap-3">
          {navItems.map(({ icon: Icon, label, link }) => (
            <button
              key={label}
              className="flex items-center gap-3 text-white hover:bg-zinc-800 p-2 rounded transition"
              onClick={() => {
                navigate(link);
                toggle();
              }}
            >
              <Icon size={28} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
