import React, { createContext, useContext, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";

const OwnerContext = createContext(null);

export function OwnerProvider({ children }) {
  const [session, setSession] = useState(() => base44.owner.session());

  const value = useMemo(
    () => ({
      owner: session,
      isOwner: Boolean(session?.token),
      async login(email, password) {
        const next = await base44.owner.login(email, password);
        setSession(next);
        return next;
      },
      logout() {
        base44.owner.logout();
        setSession(null);
      },
    }),
    [session]
  );

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export function useOwner() {
  const context = useContext(OwnerContext);
  if (!context) throw new Error("useOwner must be used within an OwnerProvider");
  return context;
}
