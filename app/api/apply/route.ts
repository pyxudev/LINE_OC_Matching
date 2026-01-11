import { NextResponse } from "next/server";
import { getIdea, saveIdea } from "@/lib/blob";
import { resend } from "@/lib/mail";

export async function POST(req: Request) {
  const { ideaId, applicantName, applicantEmail } = await req.json();

  const idea = await getIdea(ideaId);

  await resend.emails.send({
    from: applicantEmail,
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
