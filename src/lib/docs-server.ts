import fs from "fs";
import path from "path";
import type { DocArticle, DocCategory } from "./docs-client";
import { formatDisplayName } from "./docs-client";

// 記事ファイル名からslugを生成（.md削除）
export const generateSlug = (articleName: string): string => {
	return articleName
		.replace(/\.md$/, "")
		.toLowerCase();
};

// slugから記事ファイル名を取得（ディレクトリ内のmdファイルを検索）
export const getArticleNameFromSlug = (categoryName: string, slug: string): string | null => {
	const categoryPath = path.join(process.cwd(), "public/docs", categoryName);
  
	try {
		const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isFile() && entry.name.endsWith(".md")) {
				const articleSlug = generateSlug(entry.name);
				if (articleSlug === slug) {
					return entry.name;
				}
			}
		}
	} catch (error) {
		console.error(`Error reading category ${categoryName}:`, error);
	}
  
	return null;
};

// docs配下のディレクトリ構造を読み込む（サーバーサイド専用）
export const getDocsStructure = (): DocCategory[] => {
	const docsPath = path.join(process.cwd(), "public/docs");
	const categories: DocCategory[] = [];

	try {
		const entries = fs.readdirSync(docsPath, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.isDirectory() && !entry.name.startsWith("_") && entry.name !== "[slug]") {
				const categoryPath = path.join(docsPath, entry.name);
				const articles: DocArticle[] = [];

				// ディレクトリ内のmdファイルを読み込む
				try {
					const categoryEntries = fs.readdirSync(categoryPath, { withFileTypes: true });
					for (const articleEntry of categoryEntries) {
						if (articleEntry.isFile() && articleEntry.name.endsWith(".md")) {
							const articleName = articleEntry.name;
							const slug = generateSlug(articleName);
							const displayName = formatDisplayName(articleName.replace(/\.md$/, ""));

							articles.push({
								name: displayName,
								slug: slug,
								path: `/docs/${entry.name}/${slug}`,
							});
						}
					}
				} catch (error) {
					console.error(`Error reading category ${entry.name}:`, error);
				}

				categories.push({
					name: entry.name,
					path: `/docs/${entry.name}`,
					articles: articles.sort((a, b) => a.name.localeCompare(b.name)),
				});
			}
		}
	} catch (error) {
		console.error("Error reading docs directory:", error);
	}

	return categories.sort((a, b) => a.name.localeCompare(b.name));
};