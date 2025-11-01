import type { RealtimeClient } from "@repo/realtime/client";
import type { IUser, IUserZustandStore } from "@repo/shared/types";
import { create } from "zustand";
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
  onlineUsers: string[];
  client: RealtimeClient | null;

  setProfile: (user: IUser, isPending: boolean, isError: boolean) => void;
  setAuth: (token: string) => void;
  logout: () => void;
  setIsOnline: (status: boolean) => void;
  setOnlineUsers: (users: string[]) => void;
  setClient: (client: RealtimeClient) => void;
}

// Custom storage que maneja la serialización
const customStorage = {
  getItem: (name: string) => {
    try {
      const item = sessionStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  setItem: (name: string, value: any): void => {
    try {
      // Eliminar client del estado antes de guardar
      if (value.state && value.state.client !== undefined) {
        const { client, ...stateWithoutClient } = value.state;
        sessionStorage.setItem(name, JSON.stringify({
          ...value,
          state: stateWithoutClient
        }));
      } else {
        sessionStorage.setItem(name, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
  removeItem: (name: string): void => {
    sessionStorage.removeItem(name);
  },
};

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
      onlineUsers: [],
      client: null,
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
        set((state) => {
          if (state.client) {
            state.client.disconnect();
          }
          return {
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
            onlineUsers: [],
            client: null,
          };
        }),
      setIsOnline: (status: boolean) =>
        set((state) => ({
          auth: {
            ...state.auth,
            isOnline: status,
          },
        })),
      setOnlineUsers: (users: string[]) =>
        set({
          onlineUsers: users,
        }),
      setClient: (client: RealtimeClient) =>
        set({
          client,
        }),
    }),
    {
      name: "global-storage",
      storage: customStorage,
    }
  )
);
