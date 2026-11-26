import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
const AccountContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});
export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) {
        setUser(data.user);
        setLoading(false);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED")
        void router.invalidate();
    });
    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [router]);
  return <AccountContext.Provider value={{ user, loading }}>{children}</AccountContext.Provider>;
}
export const useAccount = () => useContext(AccountContext);
