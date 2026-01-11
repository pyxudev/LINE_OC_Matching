"use server";

import {
  readIndex,
  writeIndex,
  readProject,
  writeProject,
} from "../lib/blob";
import { sha256, now } from "../lib/utils";
import { rateLimit } from "../lib/rateLimit";
import { sendApplyMail } from "../lib/mail";

export async function applyProject(formData: FormData) {
  rateLimit("apply-project");

  const id = String(formData.get("id"));
  const chatName = String(formData.get("chatName") || "").slice(0, 30);
  const email = String(formData.get("email") || "");

  if (!id || !chatName || !email) {
    throw new Error("Invalid input");
  }

  const project = await readProject(id);
  const hash = sha256(email);

  if (project.applicants.some((a: any) => a.emailHash === hash)) {
    throw new Error("Already applied");
  }

  project.applicants.push({
    chatName,
    emailHash: hash,
    createdAt: now(),
  });

  await writeProject(id, project);

  const index = await readIndex();
  const item = index.projects.find((p: any) => p.id === id);
  if (item) {
    item.applicantCount++;
    item.projectUrl = `https://blob.vercel-storage.com/projects/${id}.json`;
  }

  await writeIndex(index);

  await sendApplyMail(
    project.owner.email,
    email,
    chatName,
    project.title
  );
}
