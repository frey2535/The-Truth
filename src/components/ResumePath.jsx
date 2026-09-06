import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { takeResumePath } from "@/lib/resumePath";

export default function ResumePath() {
  const navigate = useNavigate();
  useEffect(() => {
    const dest = takeResumePath();
    if (dest) navigate(dest, { replace: true });
  }, [navigate]);
  return null;
}
