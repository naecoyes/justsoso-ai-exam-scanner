import { openDB } from "idb";

const DB_NAME = "mimo-photo-solver";
const STORE_NAME = "history";

async function getLocalDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    }
  });
}

export async function migrateHistoryToServer() {
  try {
    const db = await getLocalDb();
    const items = await db.getAll(STORE_NAME);
    if (items.length > 0) {
      for (const item of items) {
        try {
          const res = await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
          });
          if (res.ok) {
            await db.delete(STORE_NAME, item.id);
          }
        } catch (e) {
          console.error("Failed to migrate item:", item.id, e);
        }
      }
    }
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

export async function getHistoryItems() {
  try {
    let serverItems = [];
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        serverItems = data.history || [];
      }
    } catch (e) {
      console.warn("Failed to fetch server history:", e);
    }

    let localItems = [];
    try {
      const db = await getLocalDb();
      localItems = await db.getAll(STORE_NAME);
    } catch (e) {
      console.warn("Failed to fetch local history:", e);
    }

    const allItems = [...serverItems, ...localItems];
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
    
    return uniqueItems.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function addHistoryItem(item) {
  try {
    const nextItem = {
      ...item,
      id: `${item.createdAt}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`
    };
    
    const res = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextItem)
    });
    
    if (!res.ok) return [];
    return getHistoryItems();
  } catch {
    return [];
  }
}

export async function clearHistory() {
  try {
    await fetch("/api/history", { method: "DELETE" });
    return [];
  } catch {
    return [];
  }
}

export async function deleteHistoryItem(id) {
  try {
    await fetch(`/api/history?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    return getHistoryItems();
  } catch {
    return [];
  }
}
