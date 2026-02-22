// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { supabase } from "../services/supabase-client";
// import { getMyRole } from "../services/auth-service";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [session, setSession] = useState(null);

//   const [role, setRole] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [roleLoading, setRoleLoading] = useState(true);

//   async function loadRole(sess) {
//     const userId = sess?.user?.id;
//     if (!userId) {
//       setRole(null);
//       setRoleLoading(false);
//       return;
//     }

//     setRoleLoading(true);
//     const r = await getMyRole(userId);
//     setRole(r);
//     setRoleLoading(false);
//   }

//   useEffect(() => {
//     let alive = true;

//     (async () => {
//       const sess = await supabase.auth.getSession();
//       if (!alive) return;

//       const current = sess.data.session ?? null;
//       setSession(current);
//       await loadRole(current);
//       setAuthLoading(false);
//     })();

//     const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, newSession) => {
//       setSession(newSession ?? null);
//       await loadRole(newSession ?? null);
//       setAuthLoading(false);
//     });

//     return () => {
//       alive = false;
//       sub.subscription.unsubscribe();
//     };
//   }, []);

//   const value = useMemo(() => {
//     const user = session?.user ?? null;
//     const loading = authLoading || roleLoading;

//     return {
//       session,
//       user,
//       role,
//       isAdmin: role === "admin",
//       loading,
//     };
//   }, [session, role, authLoading, roleLoading]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
//   return ctx;
// }



import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../services/supabase-client";
import { getMyRole } from "../services/auth-service";

const AuthContext = createContext(null);

function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Role lookup timed out")), ms)
    ),
  ]);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  // ✅ cache so tab-focus/token refresh doesn't keep re-loading role
  const lastUserIdRef = useRef(null);
  const roleCacheRef = useRef(new Map()); // userId -> role string (or null)

  async function loadRole(sess, { force = false } = {}) {
    const userId = sess?.user?.id;

    if (!userId) {
      lastUserIdRef.current = null;
      setRole(null);
      setRoleLoading(false);
      return;
    }

    // If same user and we already have role, don't refetch (prevents loading on tab switches)
    const cached = roleCacheRef.current.get(userId);
    const sameUser = lastUserIdRef.current === userId;

    if (!force && sameUser && cached !== undefined) {
      setRole(cached);
      setRoleLoading(false);
      return;
    }

    // if we have cached value even if not sameUser yet, use it immediately
    if (!force && cached !== undefined) {
      lastUserIdRef.current = userId;
      setRole(cached);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);

    try {
      // ✅ timeout prevents "stuck loading forever"
      const r = await withTimeout(getMyRole(userId), 5000);
      const normalized = r ?? null;

      roleCacheRef.current.set(userId, normalized);
      lastUserIdRef.current = userId;
      setRole(normalized);
    } catch (err) {
      console.error("getMyRole failed:", err);

      // fallback: don't get stuck loading; set role null
      roleCacheRef.current.set(userId, null);
      lastUserIdRef.current = userId;
      setRole(null);
    } finally {
      setRoleLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const sessRes = await supabase.auth.getSession();
        if (!alive) return;

        const current = sessRes?.data?.session ?? null;
        setSession(current);

        await loadRole(current);
      } catch (err) {
        console.error("getSession failed:", err);
        if (!alive) return;

        setSession(null);
        setRole(null);
        setRoleLoading(false);
      } finally {
        if (!alive) return;
        setAuthLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, newSession) => {
      if (!alive) return;

      setSession(newSession ?? null);

      // ✅ do NOT force role reload unless user changed
      await loadRole(newSession ?? null, { force: false });

      setAuthLoading(false);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    const loading = authLoading || roleLoading;

    return {
      session,
      user,
      role,
      isAdmin: role === "admin",
      loading,
    };
  }, [session, role, authLoading, roleLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
