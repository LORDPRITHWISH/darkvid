import { useNavigate, useLocation } from "react-router";
import { studioNavLinks } from "@/utils/studioNavLinks";
import { useStudioSidebar } from "@/store/studioSidebarStore";
import { useUserStore } from "@/store/userStore";

export default function StudioSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useStudioSidebar((s) => s.collapsed);
  const { name, username, profilePhoto } = useUserStore((s) => s);

  const isActive = (link: string) => {
    const path = location.pathname;
    if (link === "") return path === "/studio" || path === "/studio/";
    return path === `/studio/${link}` || path.startsWith(`/studio/${link}/`);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-full bg-[#0f0f0f] border-r border-zinc-800/60
        flex flex-col transition-all duration-200 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[224px]"}
      `}
    >
      {/* Logo row */}
      <div
        className={`
          flex items-center h-14 shrink-0 border-b border-zinc-800/60
          ${collapsed ? "justify-center px-0" : "px-4 gap-3"}
        `}
      >
        {!collapsed && (
          <>
            <img src="/darkvid_logo.png" alt="logo" className="h-6 shrink-0" />
            <span className="text-white font-semibold text-sm tracking-wide">
              Studio
            </span>
          </>
        )}
        {collapsed && (
          <img src="/darkvid_logo.png" alt="logo" className="h-6" />
        )}
      </div>

      {/* ── Channel Meta ─────────────────────────────────────────────── */}
      <div
        className={`
          shrink-0 border-b border-zinc-800/60 transition-all duration-200
          ${collapsed
            ? "flex justify-center items-center py-3"
            : "flex flex-col items-center gap-2 py-5 px-4"
          }
        `}
      >
        {/* Avatar */}
        <div
          className={`
            rounded-full overflow-hidden bg-zinc-700 shrink-0 ring-2 ring-zinc-700 transition-all duration-200
            ${collapsed ? "w-9 h-9" : "w-24 h-24"}
          `}
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={name ?? "channel"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-purple-800">
              <span
                className={`text-white font-bold select-none ${
                  collapsed ? "text-xs" : "text-xl"
                }`}
              >
                {name ? name.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
          )}
        </div>

        {/* Text — hidden in collapsed mode */}
        {!collapsed && (
          <div className="flex flex-col items-center gap-0.5 w-full overflow-hidden">
            <span className="text-white text-[13px] font-semibold truncate w-full text-center">
              Your channel
            </span>
            <span className="text-zinc-400 text-[11px] truncate w-full text-center uppercase tracking-wider">
              {username ?? ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Nav Links ────────────────────────────────────────────────── */}
      <nav
        className={`
          flex-1 py-2
          ${collapsed
            ? "overflow-y-scroll sidebar-scrollbar"
            : "overflow-y-auto scrollbar-hide"
          }
        `}
      >
        {studioNavLinks.map(({ icon: Icon, label, link }) => {
          const active = isActive(link);
          return (
            <button
              key={label}
              id={`studio-nav-${link || "dashboard"}`}
              title={label}
              onClick={() => navigate(`/studio${link ? `/${link}` : ""}`)}
              className={`
                w-full flex items-center transition-colors duration-150 relative group
                ${collapsed
                  ? "justify-center py-3.5 px-0"
                  : "flex-row gap-4 py-2.5 px-6"
                }
                ${active
                  ? "text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {/* Active bg pill */}
              {active && !collapsed && (
                <span className="absolute inset-y-1 inset-x-2 bg-white/10 rounded-lg -z-10" />
              )}
              {active && collapsed && (
                <span className="absolute inset-0 bg-white/10 -z-10" />
              )}

              <Icon
                size={collapsed ? 20 : 18}
                className="shrink-0"
                strokeWidth={active ? 2.5 : 1.75}
              />

              {/* Label — only in expanded mode */}
              {!collapsed && (
                <span className="text-[13px] font-medium truncate">{label}</span>
              )}

              {/* Right popover tooltip — only in collapsed mode */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-150 group-hover:translate-x-0 translate-x-[-4px]">
                  {/* Arrow caret */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-[5px] border-transparent border-r-zinc-700" />
                  <div className="px-3 py-1.5 bg-[#1c1c1e] border border-zinc-700 text-white text-xs font-medium rounded-lg whitespace-nowrap shadow-2xl">
                    {label}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom links ─────────────────────────────────────────────── */}
      <div className="border-t border-zinc-800/60 py-2 shrink-0 space-y-0.5">
        {[
          { label: "Settings", path: "/studio/settings" },
          { label: "View channel", path: "/" },
        ].map(({ label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            title={label}
            className={`
              w-full flex items-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors relative group
              ${collapsed ? "justify-center py-3.5 px-0" : "gap-4 py-2 px-6"}
            `}
          >
            {label === "Settings" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width={collapsed ? 20 : 18} height={collapsed ? 20 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width={collapsed ? 20 : 18} height={collapsed ? 20 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            )}

            {/* Label — expanded only */}
            {!collapsed && (
              <span className="text-[13px] font-medium">{label}</span>
            )}

            {/* Right popover — collapsed only */}
            {collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-150 group-hover:translate-x-0 translate-x-[-4px]">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-[5px] border-transparent border-r-zinc-700" />
                <div className="px-3 py-1.5 bg-[#1c1c1e] border border-zinc-700 text-white text-xs font-medium rounded-lg whitespace-nowrap shadow-2xl">
                  {label}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
