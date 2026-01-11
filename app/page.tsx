import { readIndex } from "./lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Page() {
  const { projects } = await readIndex();

  return (
    <main style={{ padding: 24 }}>
      <h1>募集中のプロジェクト</h1>

      {projects.length === 0 && (
        <p>現在募集中のアイディアはありません</p>
      )}

      {projects.length > 0 && (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>タイトル</th>
              <th>詳細</th>
              <th>発案者</th>
              <th>応募数</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.detail}</td>
                <td>{p.ownerName}</td>
                <td>{p.applicants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
