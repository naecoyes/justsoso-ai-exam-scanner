import { openDB } from "idb";

const DB_NAME = "mimo-photo-solver";
const STORE_NAME = "history";
const MAX_HISTORY = 12;

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    }
  });
}

export async function getHistoryItems() {
  const db = await getDb();
  const items = await db.getAll(STORE_NAME);
  return sortItems(items);
}

export async function addHistoryItem(item) {
  const db = await getDb();
  const nextItem = {
    ...item,
    id: `${item.createdAt}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`
  };

  await db.put(STORE_NAME, nextItem);
  const items = sortItems(await db.getAll(STORE_NAME));
  const overflow = items.slice(MAX_HISTORY);
  await Promise.all(overflow.map((entry) => db.delete(STORE_NAME, entry.id)));
  return items.slice(0, MAX_HISTORY);
}

function sortItems(items) {
  return [...items].sort((a, b) => b.createdAt - a.createdAt);
}
