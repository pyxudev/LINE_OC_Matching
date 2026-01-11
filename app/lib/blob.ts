import { put, head } from "@vercel/blob";

const INDEX_URL = process.env.BLOB_INDEX_URL!;

/* --------------------
   index.json
-------------------- */

export async function readIndex() {
  try {
    const res = await fetch(INDEX_URL, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { projects: [] };
  }
}

export async function writeIndex(data: any) {
  await put(
    "projects/index.json",
    JSON.stringify(data),
    {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      allowOverwrite: true,
    }
  );
}

/* --------------------
   project
-------------------- */

export async function readProject(id: string) {
  const url = INDEX_URL.replace(
    "projects/index.json",
    `projects/${id}.json`
  );

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Project not found");
  }
  return await res.json();
}

export async function writeProject(id: string, data: any) {
  await put(
    `projects/${id}.json`,
    JSON.stringify(data),
    {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      allowOverwrite: true,
    }
  );
}
