import { NextResponse } from "next/server";
import { getIdea, saveIdea } from "@/lib/blob";
import { resend } from "@/lib/mail";

export async function POST(req: Request) {
  const { ideaId, applicantName, applicantEmail } = await req.json();

  if (!applicantEmail?.trim()) {
    return NextResponse.json({ ng: false });
  }

  const idea = await getIdea(ideaId);

  if (!idea.ownerEmail?.trim()) {
    return NextResponse.json({ ng: false });
  }

  await resend.emails.send({
    from: "info@lowlevelengineers.com",
    to: idea.ownerEmail,
    subject: `【参加希望】${idea.title}`,
    replyTo: applicantEmail,
    text: `
参加希望者から連絡がありました。

オープンチャット名: ${applicantName}
メールアドレス: ${applicantEmail}

このメールに直接返信してください。
`,
  });

  const updated = {
    ...idea,
    applicants: idea.applicants + 1,
    applicantNames: [...idea.applicantNames, applicantName],
  };

  await saveIdea(ideaId, updated);

  return NextResponse.json({ ok: true });
}
