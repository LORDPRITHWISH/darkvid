import { Link, useLocation } from "react-router";
import { LayoutDashboard, Video, Users, Settings, LogOut } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const adminNavLinks = [
  { icon: LayoutDashboard, label: "Dashboard", link: "/admin" },
  { icon: Video, label: "Videos", link: "/admin/videos" },
  { icon: Users, label: "Users", link: "/admin/users" },
  { icon: Settings, label: "Settings", link: "/admin/settings" },
];

export default function AdminSidebar({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();
  const user = useUserStore();

  return (
    <aside 
      className={`${collapsed ? "w-[68px]" : "w-[220px]"} transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] h-[calc(100vh-60px)] bg-[#09090b] border-r border-white/5 flex flex-col`}
    >
      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-3 flex flex-col gap-1 ${collapsed ? "px-2.5" : "px-3"}`}>
        {adminNavLinks.map(({ icon: Icon, label, link }) => {
          const isActive = location.pathname === link || (link !== "/admin" && location.pathname.startsWith(link));
          
          const content = (
            <Link
              key={label}
              to={link}
              className={`flex items-center h-9 rounded-lg transition-all duration-200 ${
                collapsed ? "justify-center" : "px-3 gap-3"
              } ${
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 font-medium" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={`shrink-0 ${isActive ? "text-indigo-400" : ""}`} />
              {!collapsed && <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>}
            </Link>
          );

          return collapsed ? (
            <HoverCard key={label} openDelay={0} closeDelay={50}>
              <HoverCardTrigger asChild>
                {content}
              </HoverCardTrigger>
              <HoverCardContent side="right" sideOffset={12} className="w-auto px-2.5 py-1 bg-zinc-900 border-white/10 text-white rounded-md shadow-xl text-xs font-medium">
                {label}
              </HoverCardContent>
            </HoverCard>
          ) : content;
        })}
      </nav>

      {/* User Profile Area */}
      <div className={`pt-3 pb-2 border-t border-white/5 transition-all duration-300 ${collapsed ? "px-2.5" : "px-3"}`}>
        {collapsed ? (
          <HoverCard openDelay={0} closeDelay={50}>
            <HoverCardTrigger asChild>
              <div className="w-8 h-8 mx-auto rounded-full overflow-hidden border border-white/10 cursor-pointer">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                    {user.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="right" sideOffset={12} className="w-auto p-2 bg-zinc-900 border-white/10 text-white rounded-md shadow-xl">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-zinc-400">{user.email}</p>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <div className="flex items-center gap-2 overflow-hidden bg-white/[0.02] p-2 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className={`pb-3 transition-all duration-300 ${collapsed ? "px-2.5" : "px-3"}`}>
        {collapsed ? (
          <HoverCard openDelay={0} closeDelay={50}>
            <HoverCardTrigger asChild>
              <Link
                to="/"
                className="flex items-center justify-center h-9 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors mt-1"
              >
                <LogOut size={18} className="shrink-0" />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent side="right" sideOffset={12} className="w-auto px-2.5 py-1 bg-zinc-900 border-white/10 text-red-400 rounded-md shadow-xl text-xs font-medium">
              Exit Admin
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Link
            to="/"
            className="flex items-center px-3 gap-3 h-9 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors mt-1"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis font-medium">Exit Admin</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
