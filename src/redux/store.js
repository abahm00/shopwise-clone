import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const userFromLocalStorage = localStorage.getItem("user");

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null,
      isAuthenticated: !!userFromLocalStorage,
    },
  },
});
