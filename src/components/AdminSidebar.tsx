import { Link, useLocation } from "react-router";
import { LayoutDashboard, Video, Users, Settings, LogOut } from "lucide-react";

export const adminNavLinks = [
  { icon: LayoutDashboard, label: "Dashboard", link: "/admin" },
  { icon: Video, label: "Videos", link: "/admin/videos" },
  { icon: Users, label: "Users", link: "/admin/users" },
  { icon: Settings, label: "Settings", link: "/admin/settings" },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col sticky top-0">
      <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
        <img src="/darkvid_logo.png" alt="logo" className="h-8" />
        <h1 className="text-2xl font-bold text-white tracking-wider">Admin</h1>
      </div>

      <nav className="flex-1 mt-6 px-4 flex flex-col gap-2">
        {adminNavLinks.map(({ icon: Icon, label, link }) => {
          const isActive = location.pathname === link || (link !== "/admin" && location.pathname.startsWith(link));
          return (
            <Link
              key={label}
              to={link}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <Icon size={22} className={isActive ? "text-white" : "text-zinc-400"} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut size={22} />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
}
