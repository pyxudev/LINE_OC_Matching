import { put } from "@vercel/blob";

const INDEX_PATH = "projects/index.json";

/* ------------------
 * index.json
 * ------------------ */

export async function readIndex() {
  try {
    const res = await fetch(
      `https://blob.vercel-storage.com/${INDEX_PATH}`
    );
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { projects: [] };
  }
}

export async function writeIndex(data: any) {
  const blob = await put(
    INDEX_PATH,
    JSON.stringify(data),
    { access: "public" }
  );
  return blob.url;
}

/* ------------------
 * project
 * ------------------ */

export async function writeProject(id: string, data: any) {
  const blob = await put(
    `projects/${id}.json`,
    JSON.stringify(data),
    { access: "public" }
  );
  return blob.url;
}

export async function readProject(projectUrl: string) {
  const res = await fetch(projectUrl);
  if (!res.ok) {
    throw new Error("Project not found");
  }
  return await res.json();
}
