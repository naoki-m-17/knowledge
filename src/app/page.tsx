import "./home.scss";

export default function Home() {
  return (
    <div className="home">
      <main className="home__main">
        <h1 className="home__title">My Knowledge Base (Under Construction)</h1>
        <p className="home__description">
          このナレッジベースは現在構築中です。
        </p>
        <div className="home__linkSection">
          <h2 className="home__sectionTitle">ドキュメント</h2>
          <ul className="home__linkList">
            <li>
              <a href="/docs/firebase" className="home__link">
                Firebase関連ドキュメント
              </a>
            </li>
            <li>
              <a href="/docs/nextjs" className="home__link">
                Next.js環境構築の記録
              </a>
            </li>
            <li>
              <a href="/docs/github" className="home__link">
                Git/GitHubの操作手順
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
