"use client";

import { useEffect, useState } from "react";
import { Idea } from "@/types/idea";

export default function Page() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [form, setForm] = useState({
    title: "",
    detail: "",
    ownerName: "",
    ownerEmail: "",
  });

  async function load() {
    const res = await fetch("/api/ideas", {
      cache: "no-store",
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      console.log("No ideas found");
    } else {
      setIdeas(data);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    await fetch("/api/ideas", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setForm({ title: "", detail: "", ownerName: "", ownerEmail: "" });
    await load();
  }

  async function apply(id: number) {
    const name = prompt("オープンチャット名");
    const email = prompt("メールアドレス");
    if (!name || !email) return;

    await fetch("/api/apply", {
      method: "POST",
      body: JSON.stringify({
        ideaId: id,
        applicantName: name,
        applicantEmail: email,
      }),
    });
    await load();
  }
  

  return (
    <>
    <main style={{ padding: 24 }}>
      <h1>LINE OC Idea Matching APP</h1>
      <h2>プロジェクト新規募集</h2>
      <input placeholder="タイトル" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} />
      <br />
      <textarea placeholder="詳細" value={form.detail}
        onChange={e => setForm({ ...form, detail: e.target.value })} />
      <br />
      <input placeholder="オープンチャット名" value={form.ownerName}
        onChange={e => setForm({ ...form, ownerName: e.target.value })} />
      <br />
      <input placeholder="メールアドレス（非公開）" value={form.ownerEmail}
        onChange={e => setForm({ ...form, ownerEmail: e.target.value })} />
      <br />
      <button onClick={submit}>募 集</button>

      <hr></hr>
      <details>
        <summary>本サービス利用方法</summary>
        <p>1. 画面下部の「新規募集」欄にアイディアのタイトル、詳細、オープンチャット名、メールアドレス（非公開）を入力し、「募集」ボタンをクリックしてください。</p>
        <p>2. 募集が完了し、しばらくして画面を更新すると、「募集中一覧」にアイディアが表示されます。</p>
        <p>3. 他の人が投稿したアイディアに参加したい場合は、「参加」ボタンをクリックし、オープンチャット名とメールアドレスを入力してください。(2回に分けて提出する必要がございます。)</p>
        <p>4. 応募が完了すると、発案者にメールが届きます。</p>
        <p>5. 発案者は応募者と連絡を取り、プロジェクトを進めてください。</p>
        <p>注意事項: 本サービスはアイディアの募集と応募を支援するものであり、プロジェクトの成功や成果を保証するものではありません。<br />プロジェクトの進行や成果に関しては、発案者と応募者の責任で行ってください。<br />個人情報の管理は利用者様にお願いしております。<br />管理人は個人間でのやり取りにおける個人情報の漏洩やトラブルに一切責任を負いません。</p>
        <p>ご不明な点または投稿済み内容の変更・取り下げは、管理者までお問い合わせください。</p>
      </details>
      <hr></hr>

      <h2>募集中一覧</h2>
      <table border={1}>
        <thead>
          <tr>
            <th className="title">タイトル</th>
            <th className="details">詳細</th>
            <th className="starter">発案者</th>
            <th className="number">応募者数</th>
            <th className="join">参加</th>
          </tr>
        </thead>
        <tbody>
          {ideas.length === 0 ? (
            <tr>
              <td colSpan={5}>募集はまだありません。</td>
            </tr>
          ) : null}
          {ideas.map(i => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.detail}</td>
              <td>{i.ownerName}</td>
              <td>{i.applicants}</td>
              <td>
                <button onClick={() => apply(i.id)}>参 加</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
    <footer style={{ textAlign: "center", marginTop: 24 }}>
      <hr></hr>
      <p>LINE OC Idea Matching - created by Justin Xu</p>
    </footer>
    </>
  );
}
