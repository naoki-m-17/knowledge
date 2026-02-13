import { FC } from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { getArticleNameFromSlug } from "@/lib/docs-server";
import CodeBlock from "@/components/CodeBlock";
import "../../docs.scss";

interface DocPageProps {
	params: Promise<{ category: string; slug: string }>;
}

// 記事内リンクURLをNext.jsのルートに変換
const convertMarkdownLinkToRoute = (href: string, currentCategory: string): string => {
	// 外部リンクの場合はそのまま返す
	if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
		return href;
	}

	// .mdを削除
	let cleanHref = href.replace(/\.md$/, "");

	// 相対パスの処理
	if (cleanHref.startsWith("./")) {
		// 同じカテゴリ内のリンク: ./props.md → /docs/react/props
		cleanHref = `/docs/${currentCategory}${cleanHref.slice(1)}`;
	} else if (cleanHref.startsWith("../")) {
		// 親ディレクトリへのリンク: ../nextjs/article.md → /docs/nextjs/article
		const parts = cleanHref.split("/");
		const targetCategory = parts[1];
		const targetSlug = parts.slice(2).join("/");
		cleanHref = `/docs/${targetCategory}/${targetSlug}`;
	} else if (cleanHref.startsWith("/docs/")) {
		// 既に/docs/で始まっている場合: /docs/react/props.md → /docs/react/props
		cleanHref = cleanHref.replace(/\.md$/, "");
	} else if (!cleanHref.startsWith("/")) {
		// 相対パス（./なし）: props.md → /docs/react/props
		cleanHref = `/docs/${currentCategory}/${cleanHref}`;
	}

	return cleanHref;
};

const DocPage: FC<DocPageProps> = async ({ params }) => {
	const { category, slug } = await params;
	const articleName = getArticleNameFromSlug(category, slug);

	if (!articleName) {
		notFound();
	}

	const filePath = path.join(process.cwd(), "public/docs", category, articleName);
  
	let content = "";
	try {
		content = fs.readFileSync(filePath, "utf-8");
	} catch (error) {
		notFound();
	}

	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				a: ({ href, children, ...props }) => {
					if (!href) {
						return <a {...props}>{children}</a>;
					}

					const convertedHref = convertMarkdownLinkToRoute(href, category);
					// 外部リンク
					if (convertedHref.startsWith("http://") || convertedHref.startsWith("https://") || convertedHref.startsWith("mailto:")) {
						return (
							<a href={convertedHref} {...props} target="_blank" rel="noopener noreferrer">
								{children}
							</a>
						);
					}
					// 内部リンク → Next.js Linkコンポーネント
					return (
						<Link href={convertedHref} {...props}>
							{children}
						</Link>
					);
				},
				pre: ({ children, ...props }) => {
					return <CodeBlock {...props}>{children}</CodeBlock>;
				},
			}}
		>
			{content}
		</ReactMarkdown>
	);
};

export default DocPage;