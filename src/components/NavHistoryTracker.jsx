import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordNavPath } from "@/lib/navHistory";

/** Keep an in-app history stack for the header Back button. */
export default function NavHistoryTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    recordNavPath(`${pathname}${search || ""}`);
  }, [pathname, search]);
  return null;
}
