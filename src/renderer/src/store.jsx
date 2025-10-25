import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  unRead : [],
  setUnRead : (unRead) => set({unRead}),
  notifications : [],
  // ✅ Global state
  user: {
    id: 2,
    name: "Achraf",
    email: "ssportclann@gmail.com",
    username: "achraf08",
    phone_number: "0777746864",
    role: "User",
  },

  agency: {
    id: 1,
    name: "Sunny Travels",
    phone_number: "0555555858",
    creation_date: "2023-01-15T07:00:00.000Z",
    primary_curr: "DA",
    exchange_rate_selling: 500,
    exchange_rate_buying: 100,
    include_canceled_revenue: 0,
    include_canceled_expenses: 1,
    umrah_location: "Mecca",
  },

  // ✅ In-memory pages list (resets on reload)
  pages: ['Dashboard'],
  tour : null,

  // ✅ Actions
  setUser: (user) => set({ user }),
  setAgency: (agency) => set({ agency }),
  setPages : (pages) => set({pages}),
  setNotifications: (notifications) => set({notifications}),
  resetAll: () => set({ user: null, agency: null, pages: [Dashboard] }),
  
}));
