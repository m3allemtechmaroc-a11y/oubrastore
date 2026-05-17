import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, token: data.token, isLoading: false });
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },
      register: async (name: string, email: string, password: string, phone?: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, phone }),
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, token: data.token, isLoading: false });
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },
      logout: () => {
        set({ user: null, token: null });
        document.cookie = "token=; path=/; max-age=0";
      },
      checkAuth: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user });
          } else {
            set({ user: null, token: null });
          }
        } catch {
          set({ user: null, token: null });
        }
      },
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    { name: "oubra-auth" }
  )
);
