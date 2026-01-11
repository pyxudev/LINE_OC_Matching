import { NextResponse } from "next/server";
import { getIndex, saveIndex, saveIdea, getIdea } from "@/lib/blob";
import { Idea } from "@/types/idea";

export const runtime = "nodejs";

export async function GET() {
  const ids = await getIndex();
  const ideas = await Promise.all(ids.map(id => getIdea(id)));
  return NextResponse.json(ideas);
}

export async function POST(req: Request) {
  const body = await req.json();
  const ids = await getIndex();

  const id = Date.now();
  const idea: Idea = {
    id,
    title: body.title,
    detail: body.detail,
    ownerName: body.ownerName,
    ownerEmail: body.ownerEmail,
    applicants: 0,
    applicantNames: [],
  };

  await saveIdea(id, idea);
  await saveIndex([id, ...ids]);

  return NextResponse.json({ ok: true });
}
