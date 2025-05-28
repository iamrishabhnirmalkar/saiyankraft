// import { create } from "zustand";
// import Cookies from "js-cookie";

// interface AuthState {
//   token: string | null;
//   customerId: number | null;
//   setAuth: (token: string | null, customerId: number | null) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   token: null,
//   customerId: null,

//   setAuth: (token, customerId) => {
//     if (typeof window !== "undefined") {
//       if (token) {
//         Cookies.set("auth_token", token, { expires: 30 });
//       } else {
//         Cookies.remove("auth_token");
//       }

//       if (customerId) {
//         Cookies.set("customer_id", String(customerId), { expires: 30 });
//       } else {
//         Cookies.remove("customer_id");
//       }
//     }

//     set({ token, customerId });
//   },

//   logout: () => {
//     if (typeof window !== "undefined") {
//       Cookies.remove("auth_token");
//       Cookies.remove("customer_id");
//     }
//     set({ token: null, customerId: null });
//   },
// }));

import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthStore {
  token: string | null;
  user: { name: string; email: string } | null;
  setAuth: (
    token: string,
    user: { name: string; email: string } | null
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: Cookies.get("auth_token") || null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      Cookies.set("auth_token", token, { expires: 30 });
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      Cookies.remove("auth_token");
      localStorage.removeItem("user");
    }
    set({ token: null, user: null });
  },
}));
