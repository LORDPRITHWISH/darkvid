import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

type UserState = {
  userId: string | null;
  name: string | null;
  email: string | null;
  profilePhoto: string | null;

  setUser: (userId: string, name: string, profilePhoto: string, email: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
  persist(
      (set) => ({
        userId: null,
        profilePhoto: null,
        username: null,
        email: null,
        name: null,

        setUser: (userId, name, profilePhoto, email) => set({ userId, name, profilePhoto, email }),
        logout: () => set({ userId: null, name: null, profilePhoto: null, email: null }),
      }),
      {
        name: "user-store", // devtools name
      }
    ),
    {
      name: "user-store", // localStorage key
    }
  )
);
