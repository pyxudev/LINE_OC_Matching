import { put, head } from "@vercel/blob";

const BASE_URL = "https://blob.vercel-storage.com";
const INDEX_PATH = "projects/index.json";

function blobUrl(path: string) {
  return `${BASE_URL}/${path}`;
}

/* --------------------
   index.json
-------------------- */

export async function readIndex() {
  try {
    await head(INDEX_PATH, {
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    const res = await fetch(blobUrl(INDEX_PATH), {
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
    INDEX_PATH,
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
  const path = `projects/${id}.json`;

  await head(path, {
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });

  const res = await fetch(blobUrl(path), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Project not found");
  }

  return await res.json();
}

export async function writeProject(id: string, data: any) {
  const path = `projects/${id}.json`;

  await put(
    path,
    JSON.stringify(data),
    {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      allowOverwrite: true,
    }
  );
}
