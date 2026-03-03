const STORAGE_KEY = "bayan_history";

function hasWindow() {
  return typeof window !== "undefined";
}

function getStorageAdapter() {
  if (!hasWindow()) return null;

  if (window.storage) {
    return {
      async get(key) {
        const stored = await window.storage.get(key);
        return stored?.value ?? null;
      },
      async set(key, value) {
        await window.storage.set(key, value);
      },
      async delete(key) {
        await window.storage.delete(key);
      },
    };
  }

  if (window.localStorage) {
    return {
      async get(key) {
        return window.localStorage.getItem(key);
      },
      async set(key, value) {
        window.localStorage.setItem(key, value);
      },
      async delete(key) {
        window.localStorage.removeItem(key);
      },
    };
  }

  return null;
}

export async function getHistory() {
  const storage = getStorageAdapter();
  if (!storage) return [];

  try {
    const raw = await storage.get(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveHistory(history) {
  const storage = getStorageAdapter();
  if (!storage) return;

  try {
    await storage.set(STORAGE_KEY, JSON.stringify(history));
  } catch {
    return;
  }
}

export async function clearHistory() {
  const storage = getStorageAdapter();
  if (!storage) return;

  try {
    await storage.delete(STORAGE_KEY);
  } catch {
    return;
  }
}
