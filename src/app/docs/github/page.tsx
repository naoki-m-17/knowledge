import Link from "next/link";
import "./github.scss";

export default function GithubDocsPage() {
  return (
    <div className="docs">
      <main className="docs__main">
        <h1 className="docs__title">Git/GitHubの操作手順</h1>
        <div className="docs__content">
          <ul className="docs__list">
            <li>
              <Link href="/docs/github/workflow" className="docs__link">
                Git/GitHub操作手順
              </Link>
            </li>
          </ul>
        </div>
        <div className="docs__back">
          <Link href="/" className="docs__backLink">
            ← トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}

