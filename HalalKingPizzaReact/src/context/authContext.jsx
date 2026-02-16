// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase-client";
import { getMyRole } from "../services/auth-service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadRole(sess) {
    const userId = sess?.user?.id;
    if (!userId) {
      setRole(null);
      return;
    }
    const r = await getMyRole(userId);
    setRole(r);
  }

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (ignore) return;

        setSession(data.session ?? null);
        await loadRole(data.session ?? null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession ?? null);
      await loadRole(newSession ?? null);
      setLoading(false);
    });

    return () => {
      ignore = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      role,
      loading,
      isAdmin: role === "admin",
    }),
    [session, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
