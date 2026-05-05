// import { useState } from "react";
import { X } from "lucide-react";
import { useSidebarState } from "@/store/sideStore";
import { useNavigate, useLocation } from "react-router";

export default function StudioSidebar() {
  // const [open, setOpen] = useState(false);
  const { open, toggle } = useSidebarState();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        // onClick={() => setOpen(false)}
        onClick={toggle}
      />

      {/* Sidebar Panel */}
      <aside
        className={`absolute top-0 left-0 z-50 h-full bg-slate-950 w-64 shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center p-1 ">
          <button onClick={toggle} className="text-white p-2 m-2 hover:bg-gray-700 rounded-xl">
            <X size={28} className="text-white" />
          </button>
          <div className="flex items-center gap-1">
            <img src="/darkvid_logo.png" alt="logo" className="h-8" />
            <h1 className="text-2xl font-semibold text-white">DarkVids</h1>
          </div>
        </div>

        <nav className="mt-4 px-4 flex flex-col gap-3">
          {navLinks.map(({ icon: Icon, activeIcon: ActiveIcon, label, link }) => {
            const isActive = location.pathname === `/${link}` || (link === "" && location.pathname === "/");
            const CurrentIcon = isActive ? ActiveIcon : Icon;
            return (
              <button
                key={label}
                className={`flex items-center gap-3 hover:bg-zinc-800 p-2 rounded transition ${isActive ? "text-white font-bold" : "text-gray-300"}`}
                onClick={() => {
                  navigate(link);
                  toggle();
                }}>
                <CurrentIcon size={28} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
