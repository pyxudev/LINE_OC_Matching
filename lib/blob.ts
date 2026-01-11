import { put, head } from "@vercel/blob";

const INDEX_PATH = "ideas/index.json";

export async function getIndex(): Promise<number[]> {
  try {
    const res = await fetch(`https://blob.vercel-storage.com/${INDEX_PATH}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function saveIndex(ids: number[]) {
  await put(INDEX_PATH, JSON.stringify(ids), {
    access: "public",
    contentType: "application/json",
  });
}

export async function saveIdea(id: number, data: any) {
  await put(`ideas/${id}.json`, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
  });
}

export async function getIdea(id: number) {
  const res = await fetch(`https://blob.vercel-storage.com/ideas/${id}.json`);
  return await res.json();
}
