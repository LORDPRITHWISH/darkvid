import { Outlet } from "react-router";
import StudioSidebar from "@/components/StudioSidebar";
import { useStudioSidebar } from "@/store/studioSidebarStore";
import { Menu } from "lucide-react";

// ── Hamburger header identical to YouTube Studio ──────────────────────────────
function StudioHeader() {
  const toggle = useStudioSidebar((s) => s.toggle);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0f0f0f] border-b border-zinc-800/60 flex items-center px-3 gap-3">
      {/* Burger toggle */}
      <button
        onClick={toggle}
        aria-label="Toggle sidebar"
        className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/8 transition-colors shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <img src="/darkvid_logo.png" alt="DarkVids logo" className="h-6" />
        <span className="text-white font-semibold text-[15px] tracking-tight leading-none">
          Studio
        </span>
      </div>
    </header>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────────
const StudioLayout = () => {
  const collapsed = useStudioSidebar((s) => s.collapsed);

  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <StudioHeader />
      <StudioSidebar />

      {/* Offset for header (top) + sidebar (left), animate with sidebar */}
      <main
        className="flex-1 min-h-screen overflow-y-auto pt-14 transition-all duration-200 ease-in-out"
        style={{ marginLeft: collapsed ? "72px" : "224px" }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default StudioLayout;
