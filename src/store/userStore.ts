import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

type UserState = {
  userId: string | null;
  name: string | null;
  email: string | null;
  profilePhoto: string | null;
  isUserFetched: boolean;
  username: string | null;
  role: "user" | "admin" | null;
  isLoggedIn: boolean;

  setUser: (userId: string, username: string, name: string, profilePhoto: string, email: string, role: "user" | "admin" | null) => void;
  setIsUserFetched: (fetched: boolean) => void;
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
        isUserFetched: false,
        isLoggedIn: false,
        role: null,

        setUser: (userId: string, username: string, name: string, profilePhoto: string, email: string, role: "user" | "admin" | null) =>
          set({ userId, username, name, profilePhoto, email, role, isLoggedIn: true }),
        setIsUserFetched: (fetched: boolean) => set({ isUserFetched: fetched }),
        logout: () => set({ userId: null, username: null, name: null, profilePhoto: null, email: null, isLoggedIn: false, role: null }),
      }),
      {
        name: "user-store", // persist name
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => key !== "isUserFetched" && key !== "role" && key !== "isLoggedIn")),
      },
    ),
    {
      name: "user-store", // devtools name
    },
  ),
);
