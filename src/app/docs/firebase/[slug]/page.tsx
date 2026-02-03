import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import fs from "fs";
import path from "path";
import Link from "next/link";
import "../firebase.scss";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// slugからMarkdownファイル名へのマッピング
const markdownFiles: Record<string, string> = {
  "secret-manager-setup": "SECRET_MANAGER_SETUP.md",
};

export default async function FirebaseDocPage({ params }: PageProps) {
  const { slug } = await params;
  const fileName = markdownFiles[slug];

  if (!fileName) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "src/app/docs/firebase", fileName);
  
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    notFound();
  }

  return (
    <div className="docs">
      <main className="docs__main">
        <div className="docs__back">
          <Link href="/docs/firebase" className="docs__backLink">
            ← Firebase関連ドキュメントに戻る
          </Link>
        </div>
        <article className="docs__article">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
        <div className="docs__back">
          <Link href="/docs/firebase" className="docs__backLink">
            ← Firebase関連ドキュメントに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}

