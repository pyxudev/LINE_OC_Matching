import { put, head } from "@vercel/blob";

export async function saveJSON(path: string, data: unknown) {
  await put(path, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

export async function exists(path: string) {
  try {
    await head(path);
    return true;
  } catch {
    return false;
  }
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
}
