"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function useAuthReady() {
  const [authChecked, setAuthChecked] = useState(!isSupabaseConfigured());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;

    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return { authChecked, isLoggedIn, requiresLogin: isSupabaseConfigured() && authChecked && !isLoggedIn };
}
