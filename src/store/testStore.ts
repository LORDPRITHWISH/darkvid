import { create } from "zustand"; 

type UserState = {
  count: number;

  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useTester = create<UserState>()((set) => ({
  count: 0,

  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

