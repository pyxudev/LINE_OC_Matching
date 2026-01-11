import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendApplyMail(
  ownerEmail: string,
  participantEmail: string,
  chatName: string,
  title: string
) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: ownerEmail,
    replyTo: participantEmail,
    subject: `【参加希望】${title}`,
    text: `参加希望が届きました。

オープンチャット名:
${chatName}

このメールに返信すると、参加者へ直接届きます。
`,
  });
}
