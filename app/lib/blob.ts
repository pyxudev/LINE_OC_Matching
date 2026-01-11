import { put, head } from "@vercel/blob";

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN!;
const BASE_URL = process.env.BLOB_INDEX_URL!;
const INDEX_PATH = "projects/index.json";

export async function readIndex(): Promise<{
  projects: {
    id: string;
    title: string;
    detail: string;
    ownerName: string;
    applicants: number;
  }[];
}> {
  try {
    await head(INDEX_PATH, { token: TOKEN });

    const res = await fetch(`${BASE_URL}/${INDEX_PATH}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("fetch failed");

    return await res.json();
  } catch {
    return { projects: [] };
  }
}

export async function writeIndex(data: any) {
  await put(INDEX_PATH, JSON.stringify(data), {
    access: "public",
    token: TOKEN,
    allowOverwrite: true,
  });
}

export async function writeProject(id: string, data: any) {
  await put(`projects/${id}.json`, JSON.stringify(data), {
    access: "public",
    token: TOKEN,
    allowOverwrite: true,
  });
}

export async function readProject(projectUrl: string) {
  const res = await fetch(projectUrl);
  if (!res.ok) {
    throw new Error("Project not found");
  }
  return await res.json();
}