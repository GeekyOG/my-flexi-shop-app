import { getItem, removeItem, setItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction, setCredentials } from "./authSlice";
import type { RootState } from "./index";

interface User {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  skip: () => void;
  isGuest: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  skip: () => {},
  isGuest: false,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isGuest, setIsGuest] = useState(false);

  const router = useRouter();

  // Load saved credentials on mount
  useEffect(() => {
    const load = async () => {
      const savedUser = await getItem("user");
      const savedToken = await getItem("token");
      if (savedToken && savedUser) {
        dispatch(setCredentials({ user: savedUser, token: savedToken }));
      }
    };
    load();
  }, [dispatch]);

  const login = (token: string, user: User) => {
    // Save to storage
    setItem("user", user);
    setItem("token", token);

    // Update Redux store
    dispatch(setCredentials({ user, token }));
    setIsGuest(false);
  };

  const logout = async () => {
    try {
      await removeItem("user");
      await removeItem("token");
    } catch (err) {
      console.warn("Failed to clear storage during logout:", err);
    } finally {
      // Clear Redux store
      dispatch(logoutAction());
      setIsGuest(true);
      router.replace("/");
    }
  };

  const skip = () => {
    dispatch(logoutAction());
    setIsGuest(true);
  };

  const setUser = (newUser: User | null) => {
    if (newUser && token) {
      dispatch(setCredentials({ user: newUser, token }));
      setItem("user", newUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        skip,
        isGuest,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
