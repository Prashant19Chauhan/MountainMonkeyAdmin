// store/auth.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;

  hydrated: boolean;

  setHydrated: (state: boolean) => void;

  setAuth: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
};

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        token: null,
        user: null,

        hydrated: false,

        setHydrated: (state) =>
          set({
            hydrated: state,
          }),

        setAuth: (token, user) =>
          set({
            token,
            user,
          }),

        logout: () =>
          set({
            token: null,
            user: null,
          }),
      }),
      {
        name: "auth-storage",

        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      }
    )
  );