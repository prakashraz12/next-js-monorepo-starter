import { TStorageType } from "../types/storage.type";

const isServer = typeof window === "undefined";

function getStorage(type: TStorageType): Storage | null {
  if (isServer) return null;
  return type === "local" ? localStorage : sessionStorage;
}

function parseValue(value: string | null): unknown {
  if (value === null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function serializeValue(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export const storage = {
  get({ key, type = "local" }: { key: string; type?: TStorageType }): unknown {
    if (type === "cookie") {
      if (isServer) return null;
      const match = document.cookie.match(
        new RegExp(
          `(?:^|; )${key.replace(/([.$?*|{}()[\]/+^])/g, "\\$1")}=([^;]*)`,
        ),
      );
      return match && match[1]
        ? parseValue(decodeURIComponent(match[1]))
        : null;
    }

    const store = getStorage(type);
    if (!store) return null;
    return parseValue(store.getItem(key));
  },

  set({
    key,
    value,
    type = "local",
    options,
  }: {
    key: string;
    value: unknown;
    type?: TStorageType;
    options?: { days?: number; path?: string };
  }): void {
    const serialized = serializeValue(value);

    if (type === "cookie") {
      if (isServer) return;
      const days = options?.days ?? 365;
      const path = options?.path ?? "/";
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${key}=${encodeURIComponent(serialized)}; expires=${expires}; path=${path}; SameSite=Lax`;
      return;
    }

    const store = getStorage(type);
    if (!store) return;
    store.setItem(key, serialized);
  },

  remove({
    key,
    type = "local",
    options,
  }: {
    key: string;
    type?: TStorageType;
    options?: { path?: string };
  }): void {
    if (type === "cookie") {
      if (isServer) return;
      const path = options?.path ?? "/";
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      return;
    }

    const store = getStorage(type);
    if (!store) return;
    store.removeItem(key);
  },

  clear(type: TStorageType = "local"): void {
    if (type === "cookie") {
      if (isServer) return;
      document.cookie.split(";").forEach((c) => {
        const key = c.split("=")[0]?.trim() ?? "";
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
      return;
    }

    const store = getStorage(type);
    if (!store) return;
    store.clear();
  },
};
