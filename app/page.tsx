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
    const res = await fetch("/api/ideas");
    setIdeas(await res.json());
    console.log("ideas:", await res.json());
    if (await res.json() === null) {
      console.log("No ideas found");
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
    load();
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
    load();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>プロジェクト募集</h1>

      <h2>新規募集</h2>
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
      <button onClick={submit}>募集</button>

      <h2>募集中一覧</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>詳細</th>
            <th>発案者</th>
            <th>応募数</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ideas.map(i => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.detail}</td>
              <td>{i.ownerName}</td>
              <td>{i.applicants}</td>
              <td>
                <button onClick={() => apply(i.id)}>参加</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
