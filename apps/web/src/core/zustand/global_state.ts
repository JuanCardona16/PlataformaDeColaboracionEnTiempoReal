import { create } from "zustand";
import type {
  IUser,
  IUserZustandStore,
} from "../../../../../packages/shared/dist/types";
import { persist } from "zustand/middleware";

export interface GlobalState {
  auth: {
    token: string | null;
    isOnline: boolean;
    isAuthenticated: boolean;
  };
  profile: {
    user: IUserZustandStore | null;
    isPending: boolean;
    isError: boolean;
  };

  setProfile: (user: IUser, isPending: boolean, isError: boolean) => void;
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      auth: {
        token: null,
        isOnline: false,
        isAuthenticated: false,
      },
      profile: {
        user: null,
        isPending: false,
        isError: false,
      },
      setProfile: (user) =>
        set({
          profile: { user, isPending: false, isError: false },
        }),
      setAuth: (token: string) =>
        set((state) => ({
          auth: {
            ...state.auth,
            token,
            isAuthenticated: !!token,
            isOnline: !!token,
          },
        })),
      logout: () =>
        set({
          auth: {
            token: null,
            isOnline: false,
            isAuthenticated: false,
          },
          profile: {
            user: null,
            isPending: false,
            isError: false,
          },
        }),
    }),
    {
      name: "global-storage",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) =>
          sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
