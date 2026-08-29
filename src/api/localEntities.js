import { requireUser } from "./localAuth";
import { httpError, loadDb, newId, publicUser, saveDb } from "./localDb";
import { LEARN_SEED } from "@/data/seedLearn";

const ENTITY_NAMES = [
  "Evidence",
  "ScientificConfirmation",
  "GovernmentDocument",
  "StudyVerse",
  "Conversation",
  "WordStudy",
  "Lesson",
  "StudyPath",
  "StudyPlan",
  "ModernFulfillment",
  "Note",
  "Highlight",
  "Favorite",
  "Topic",
  "User",
];

const GLOBAL_ENTITIES = new Set([
  "Evidence",
  "ScientificConfirmation",
  "GovernmentDocument",
  "ModernFulfillment",
  "Lesson",
  "StudyPath",
]);

function matchesQuery(record, query) {
  if (!query || typeof query !== "object") return true;
  return Object.entries(query).every(([key, value]) => {
    if (value === undefined) return true;
    return record[key] === value;
  });
}

function sortRecords(records, sort) {
  if (!sort) return records;
  const desc = String(sort).startsWith("-");
  const field = desc ? String(sort).slice(1) : String(sort);
  return [...records].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av < bv) return desc ? 1 : -1;
    if (av > bv) return desc ? -1 : 1;
    return 0;
  });
}

function getCollection(db, name) {
  if (name === "User") return db.users.map(publicUser);
  if (!db.entities[name]) db.entities[name] = [];
  return db.entities[name];
}

function scopedList(db, user, name, records) {
  if (name === "User") {
    return user.role === "admin" ? records : records.filter((r) => r.id === user.id);
  }
  if (user.role === "admin" || GLOBAL_ENTITIES.has(name)) return records;
  if (name === "StudyVerse") {
    return records.filter((r) => r.owner_id === user.id || r.created_by_id === user.id);
  }
  return records.filter((r) => r.created_by_id === user.id);
}

function createEntityApi(name) {
  return {
    async list(sort, limit, query) {
      const { db, user } = requireUser();
      let records = scopedList(db, user, name, getCollection(db, name));
      records = records.filter((r) => matchesQuery(r, query));
      records = sortRecords(records, sort || "-created_date");
      if (typeof limit === "number") records = records.slice(0, limit);
      return records;
    },

    async filter(query, sort, limit) {
      return this.list(sort, limit, query);
    },

    async get(id) {
      const { db, user } = requireUser();
      const records = scopedList(db, user, name, getCollection(db, name));
      const found = records.find((r) => r.id === id);
      if (!found) throw httpError(`${name} not found`, 404);
      return found;
    },

    async create(data) {
      const { db, user } = requireUser();
      if (name === "User") throw httpError("Create users through registration");
      const now = new Date().toISOString();
      const record = {
        ...data,
        id: newId(name.toLowerCase()),
        created_date: now,
        updated_date: now,
        created_by_id: user.id,
        created_by: user.email,
      };
      db.entities[name].push(record);
      saveDb(db);
      return record;
    },

    async update(id, patch) {
      const { db, user } = requireUser();
      if (name === "User") {
        if (user.role !== "admin" && user.id !== id) throw httpError("Forbidden", 403);
        const target = db.users.find((u) => u.id === id);
        if (!target) throw httpError("User not found", 404);
        Object.assign(target, patch, { updated_date: new Date().toISOString() });
        saveDb(db);
        return publicUser(target);
      }
      const idx = db.entities[name].findIndex((r) => r.id === id);
      if (idx === -1) throw httpError(`${name} not found`, 404);
      const existing = db.entities[name][idx];
      if (
        user.role !== "admin" &&
        !GLOBAL_ENTITIES.has(name) &&
        existing.created_by_id !== user.id &&
        existing.owner_id !== user.id
      ) {
        throw httpError("Forbidden", 403);
      }
      const updated = {
        ...existing,
        ...patch,
        id: existing.id,
        created_date: existing.created_date,
        created_by_id: existing.created_by_id,
        updated_date: new Date().toISOString(),
      };
      db.entities[name][idx] = updated;
      saveDb(db);
      return updated;
    },

    async delete(id) {
      const { db, user } = requireUser();
      if (name === "User") throw httpError("User delete is not supported");
      const idx = db.entities[name].findIndex((r) => r.id === id);
      if (idx === -1) throw httpError(`${name} not found`, 404);
      const existing = db.entities[name][idx];
      if (
        user.role !== "admin" &&
        !GLOBAL_ENTITIES.has(name) &&
        existing.created_by_id !== user.id &&
        existing.owner_id !== user.id
      ) {
        throw httpError("Forbidden", 403);
      }
      db.entities[name].splice(idx, 1);
      saveDb(db);
      return { ok: true };
    },

    async deleteMany(query) {
      const { db, user } = requireUser();
      if (user.role !== "admin") throw httpError("Admin access required", 403);
      const before = db.entities[name].length;
      db.entities[name] = db.entities[name].filter((r) => !matchesQuery(r, query));
      saveDb(db);
      return { deleted: before - db.entities[name].length };
    },

    async bulkCreate(records) {
      const created = [];
      for (const data of records || []) {
        created.push(await this.create(data));
      }
      return created;
    },

    async bulkUpdate(updates) {
      const results = [];
      for (const item of updates || []) {
        if (!item?.id) continue;
        const { id, ...patch } = item;
        results.push(await this.update(id, patch));
      }
      return results;
    },
  };
}

export const localEntities = Object.fromEntries(ENTITY_NAMES.map((name) => [name, createEntityApi(name)]));

export function seedIfNeeded() {
  try {
    const db = loadDb();
    if (db.seeded) return;
    const now = new Date().toISOString();
    const paths = [];
    const lessons = [];
    for (const path of LEARN_SEED) {
      const pathId = newId("studypath");
      paths.push({
        id: pathId,
        title: path.title,
        slug: path.slug,
        description: path.description,
        level: path.level,
        category: path.category,
        lesson_count: path.lessons.length,
        order: path.order,
        created_date: now,
        updated_date: now,
        created_by_id: "system",
        created_by: "system",
      });
      path.lessons.forEach((lesson, i) => {
        lessons.push({
          id: newId("lesson"),
          path_id: pathId,
          title: lesson.title,
          summary: lesson.summary,
          content: lesson.content,
          order: i + 1,
          level: lesson.level || path.level,
          scripture_references: lesson.scripture_references || [],
          evidence_links: lesson.evidence_links || [],
          created_date: now,
          updated_date: now,
          created_by_id: "system",
          created_by: "system",
        });
      });
    }
    db.entities.StudyPath = paths;
    db.entities.Lesson = lessons;
    db.seeded = true;
    saveDb(db);
  } catch (error) {
    console.warn("Learn seed skipped:", error);
  }
}
