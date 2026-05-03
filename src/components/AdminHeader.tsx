import { Bell, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router";

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AdminHeader({ collapsed, setCollapsed }: AdminHeaderProps) {
  const location = useLocation();

  // Simple title generator from path
  const getTitle = () => {
    const path = location.pathname.split("/").pop();
    if (!path || path === "admin") return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-[60px] shrink-0 bg-black border-b border-white/5 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-500 hover:text-white transition-all flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-md"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-md bg-indigo-600/20 flex items-center justify-center shrink-0">
            <img src="/darkvid_logo.png" alt="logo" className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-wide whitespace-nowrap">Admin</h1>
        </div>
        <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block"></div>
        <h2 className="text-base font-medium text-zinc-400 tracking-wide hidden sm:block">
          {getTitle()}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-9 w-64 bg-white/5 border border-white/10 rounded-full pl-9 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-black"></span>
        </button>
      </div>
    </header>
  );
}
