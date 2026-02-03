import Link from "next/link";
import "./nextjs.scss";

export default function NextjsDocsPage() {
  return (
    <div className="docs">
      <main className="docs__main">
        <h1 className="docs__title">Next.js環境構築の記録</h1>
        <div className="docs__content">
          <ul className="docs__list">
            <li>
              <Link href="/docs/nextjs/setup-memo" className="docs__link">
                Next.js環境構築メモ
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

