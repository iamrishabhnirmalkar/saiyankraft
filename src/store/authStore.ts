import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get("auth_token") || null,
  setToken: (token) => {
    if (token) {
      Cookies.set("auth_token", token, { expires: 30 });
    } else {
      Cookies.remove("auth_token");
    }
    set({ token });
  },
  logout: () => {
    Cookies.remove("auth_token");
    set({ token: null });
  },
}));
