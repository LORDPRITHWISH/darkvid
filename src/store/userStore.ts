// import { create } from "zustand";

// type UserState = {
  //   userId: string | null;
//   profilePhoto: string | null;

//   setUser: (id: string, photo: string) => void;
//   logout: () => void;
// };

// export const useUserStore = create<UserState>()((set) => ({
  //   devtools((set) => ({
//     userId: null,
//     profilePhoto: null,

//     setUser: (id, photo) => set({ userId: id, profilePhoto: photo }),
//     logout: () => set({ userId: null, profilePhoto: null }),
//   }))
// }));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from 'zustand/middleware'

type UserState = {
  userId: string | null;
  profilePhoto: string | null;

  setUser: (id: string, photo: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      profilePhoto: null,

      setUser: (id, photo) => set({ userId: id, profilePhoto: photo }),
      logout: () => set({ userId: null, profilePhoto: null }),
    }),
    {
      name: "user-store", // localStorage key
    }
  )
);
