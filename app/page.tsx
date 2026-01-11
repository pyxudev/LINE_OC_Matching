import { readIndex } from "./lib/blob";
import { createProject } from "./actions/projectActions";
import { applyProject } from "./actions/projectActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Page() {
  const { projects } = await readIndex();

  return (
    <main style={{ padding: 24 }}>
      <h1>プロジェクト募集</h1>

      <form action={createProject}>
        <input name="title" placeholder="タイトル" required />
        <br />
        <textarea name="description" placeholder="詳細" />
        <br />
        <input name="chatName" placeholder="オープンチャット名" />
        <br />
        <input name="email" type="email" placeholder="メール（非公開）" required />
        <br />
        <button>募集</button>
      </form>

      <hr />
      <h1>募集中のプロジェクト</h1>

      {projects.length === 0 && (
        <p>現在募集中のアイディアはありません</p>
      )}

      {projects.length > 0 && (
                 <table border={1}>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>応募数</th>
            <th>参加</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p: any) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.applicantCount}</td>
              <td>
                <form action={applyProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <input name="chatName" placeholder="チャット名" required />
                  <input name="email" type="email" placeholder="メール" required />
                  <button>参加</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )
    }
    </main>
  );
}