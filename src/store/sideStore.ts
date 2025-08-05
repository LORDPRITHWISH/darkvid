import { create } from "zustand";

type SidebarState = {
  open: boolean;

  toggle: () => void;
};

export const useSidebarState = create<SidebarState>()((set) => ({
  open: false,

  toggle: () => set((state) => ({ open: !state.open })),
}));

