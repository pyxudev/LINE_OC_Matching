import { NextResponse } from "next/server";
import { getIdea, saveIdea } from "@/lib/blob";
import { resend } from "@/lib/mail";

export async function POST(req: Request) {
  const { ideaId, applicantName, applicantEmail } = await req.json();

  const idea = await getIdea(ideaId);

  await resend.emails.send({
    from: "match@yourdomain.dev",
    to: idea.ownerEmail,
    subject: `【参加希望】${idea.title}`,
    text: `
参加希望者から連絡がありました。

オープンチャット名: ${applicantName}
メールアドレス: ${applicantEmail}

このメールに直接返信してください。
`,
    replyTo: applicantEmail,
  });

  idea.applicants += 1;
  idea.applicantNames.push(applicantName);

  await saveIdea(ideaId, idea);

  return NextResponse.json({ ok: true });
}
