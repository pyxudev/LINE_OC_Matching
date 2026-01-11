"use server";

import { readIndex, writeIndex, writeProject } from "../lib/blob";
import { now } from "../lib/utils";
import { rateLimit } from "../lib/rateLimit";
import { randomUUID } from "crypto";

export async function createProject(formData: FormData) {
  rateLimit("create-project");

  const title = String(formData.get("title") || "").slice(0, 50);
  const description = String(formData.get("description") || "").slice(0, 1000);
  const chatName = String(formData.get("chatName") || "").slice(0, 30);
  const email = String(formData.get("email") || "");

  if (!title || !email) throw new Error("Invalid input");

  const id = randomUUID();

  const project = {
    id,
    title,
    description,
    owner: { chatName, email },
    applicants: [],
    createdAt: now(),
    isActive: true,
  };

  await writeProject(id, project);

  const index = await readIndex();
  index.projects.unshift({
    id,
    title,
    projectUrl: `https://blob.vercel-storage.com/projects/${id}.json`,
    applicantCount: 0,
    createdAt: project.createdAt,
  });

  await writeIndex(index);
}
