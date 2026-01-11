import { readIndex } from "./lib/blob";
import { createProject } from "./actions/createProject";
import { applyProject } from "./actions/applyProject";

export default async function Page() {
  const index = await readIndex();

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

      <table border={1}>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>応募数</th>
            <th>参加</th>
          </tr>
        </thead>
        <tbody>
          {index.projects.map((p: any) => (
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
    </main>
  );
}
