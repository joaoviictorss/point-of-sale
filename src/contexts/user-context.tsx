"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserData } from "@/actions/user";
import type { User, UserSession } from "@/types/user";

const UserContext = createContext<UserSession | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function UserProvider({
  children,
  initialUser = null,
}: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getUserData();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialUser) {
      fetchUser();
    }
  }, [initialUser, fetchUser]);

  const contextValue: UserSession = {
    user,
    loading,
    refetch: fetchUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser(): UserSession {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
