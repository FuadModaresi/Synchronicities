
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  useEffect(() => {
    // Mock user for UI development without real Firebase auth
    // To enable Firebase, comment out the following lines and uncomment the onAuthStateChanged listener.
    // setUser({
    //   uid: "mock-user-id",
    //   displayName: "Studio User",
    //   email: "user@studio.com",
    //   photoURL: "https://placehold.co/40x40.png",
    // } as User);
    setLoading(false);

    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   setUser(user);
    //   setLoading(false);
    // });

    // return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
