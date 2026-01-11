import { put, head } from "@vercel/blob";

export const runtime = "nodejs";

const INDEX_PATH = "ideas/index.json";

export async function getIndex(): Promise<number[]> {
  try {
    const res = await fetch(`${process.env.BLOB_ID}.public.blob.vercel-storage.com/${INDEX_PATH}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.log("index.json fetch failed:", res.status);
      return [];
   }
    const data = await res.json();
    console.log("index.json raw:", data);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveIndex(ids: number[]) {
  await put(INDEX_PATH, JSON.stringify(ids), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true
  });
}

export async function saveIdea(id: number, data: any) {
  await put(`ideas/${id}.json`, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true
  });
}

export async function getIdea(id: number) {
  const res = await fetch(`${process.env.BLOB_ID}.public.blob.vercel-storage.com/ideas/${id}.json`, {
    cache: "no-store"
  });
  return await res.json();
}
