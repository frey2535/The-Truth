import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export function useStudyMarks() {
  const [highlights, setHighlights] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState([]);

  const reload = useCallback(async () => {
    try {
      const [h, f, n] = await Promise.all([
        base44.entities.Highlight.list("-created_date", 400),
        base44.entities.Favorite.list("-created_date", 400),
        base44.entities.Note.list("-created_date", 400),
      ]);
      setHighlights(h || []);
      setFavorites(f || []);
      setNotes(n || []);
    } catch {
      /* guest/session */
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { highlights, favorites, notes, reload };
}
