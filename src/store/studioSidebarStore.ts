import { create } from "zustand";
import { persist } from "zustand/middleware";

type StudioSidebarState = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggle: () => void;
};

export const useStudioSidebar = create<StudioSidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (v) => set({ collapsed: v }),
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
    }),
    { name: "studio-sidebar" }
  )
);
