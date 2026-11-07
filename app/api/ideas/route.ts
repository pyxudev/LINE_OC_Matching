import { NextResponse } from "next/server";
import { getIndex, saveIndex, saveIdea, getIdea } from "@/lib/blob";
import { Idea } from "@/types/idea";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const ids = await getIndex();
  console.log("ids:", ids);

  const results = await Promise.allSettled(ids.map(id => getIdea(id)));
  const ideas = results
    .filter(result => result.status === "fulfilled")
    .map(result => result.value)
    .filter(
      idea =>
        idea &&
        typeof idea.ownerEmail === "string" &&
        idea.ownerEmail.trim() !== ""
    );
  
  console.log(NextResponse.json(ideas))
  return NextResponse.json(ideas);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.ownerEmail?.trim()) {
    console.log("owner_email_false");
    return NextResponse.json({ ng: "owner_email_false" });
  }

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
