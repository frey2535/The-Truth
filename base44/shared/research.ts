// Shared helper for research engines that gather records, dedupe them against
// existing entity rows by (reference field + title), and bulk-create the new ones.
export async function dedupeAndCreate(
  base44: any,
  opts: { entityName: string; refField: string; reference: string; records: any[] }
): Promise<number> {
  const { entityName, refField, reference, records } = opts;
  if (!records || records.length === 0) return 0;
  const ref = reference || (records[0]?.[refField] || "");
  const existing = ref
    ? await base44.asServiceRole.entities[entityName].filter({ [refField]: ref }, "-created_date", 200)
    : [];
  const seen = new Set((existing || []).map((e: any) => (e.title || "").toLowerCase()));
  const fresh = records.filter((e: any) => e.title && !seen.has(e.title.toLowerCase()));
  if (fresh.length === 0) return 0;
  await base44.asServiceRole.entities[entityName].bulkCreate(fresh);
  return fresh.length;
}