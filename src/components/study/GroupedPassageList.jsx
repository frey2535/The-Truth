import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { groupPassagesByDocument, shouldGroupPassages } from "@/lib/passageGrouping";

export default function GroupedPassageList({
  rows,
  renderRow,
  itemKey,
  threshold = 3,
  sourceLabel = (source) => source || "stored text",
  onOpenAll,
  className = "space-y-3",
  groupBodyClassName = "space-y-3 p-3",
}) {
  const items = Array.isArray(rows) ? rows : [];
  const groups = useMemo(() => groupPassagesByDocument(items), [items]);
  const grouped = shouldGroupPassages(items, threshold);
  const [open, setOpen] = useState(new Set());

  useEffect(() => {
    setOpen(new Set());
  }, [items]);

  if (!grouped) {
    return (
      <div className={className}>
        {items.map((row, index) => (
          <React.Fragment key={itemKey ? itemKey(row, index) : `${row?.source || ""}-${row?.reference || index}`}>
            {renderRow(row, index)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  const allOpen = groups.length > 0 && groups.every((group) => open.has(group.id));

  function openAll() {
    setOpen(new Set(groups.map((group) => group.id)));
    onOpenAll?.();
  }

  function closeAll() {
    setOpen(new Set());
  }

  function toggle(groupId) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e8ddc7] bg-white/70 px-3 py-2">
        <p className="text-xs text-[#6b6155]">
          Results are grouped by source document. Open a heading to read its related text.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={openAll} className="text-xs text-[#7a2e2e] hover:underline">
            Open all tabs
          </button>
          {allOpen ? (
            <button type="button" onClick={closeAll} className="text-xs text-[#7a2e2e] hover:underline">
              Close all
            </button>
          ) : null}
        </div>
      </div>
      {groups.map((group) => {
        const expanded = open.has(group.id);
        return (
          <section key={group.id} className="overflow-hidden rounded-2xl border border-[#e8ddc7] bg-white/70">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#f3e9c8]/40"
            >
              <span className="min-w-0">
                <span className="block font-display text-xl text-[#2b2620]">{group.title}</span>
                <span className="block text-xs uppercase tracking-wide text-[#8a7f6f]">
                  {group.rows.length} item{group.rows.length === 1 ? "" : "s"} · {sourceLabel(group.source)}
                </span>
              </span>
              {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
            </button>
            {expanded ? (
              <div className={groupBodyClassName}>
                {group.rows.map((row, index) => (
                  <React.Fragment key={itemKey ? itemKey(row, index) : `${row?.source || ""}-${row?.reference || index}`}>
                    {renderRow(row, index, group)}
                  </React.Fragment>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
