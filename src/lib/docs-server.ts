import fs from "fs";
import path from "path";
import type { DocFile, DocCategory } from "./docs-client";

/**
* ファイル名からslugを生成
*/
export const generateSlug = (fileName: string): string => {
	return fileName
		.replace(/\.md$/, "")
		.toLowerCase()
		.replace(/_/g, "-");
};

/**
* slugからファイル名を取得（ディレクトリ内のmdファイルを検索）
*/
export const getFileNameFromSlug = (categoryName: string, slug: string): string | null => {
	const categoryPath = path.join(process.cwd(), "src/app/docs", categoryName);
  
	try {
		const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isFile() && entry.name.endsWith(".md")) {
				const fileSlug = generateSlug(entry.name);
				if (fileSlug === slug) {
					return entry.name;
				}
			}
		}
	} catch (error) {
		console.error(`Error reading category ${categoryName}:`, error);
	}
  
	return null;
};

/**
* docs配下のディレクトリ構造を読み込む（サーバーサイド専用）
*/
export const getDocsStructure = (): DocCategory[] => {
	const docsPath = path.join(process.cwd(), "src/app/docs");
	const categories: DocCategory[] = [];

	try {
		const entries = fs.readdirSync(docsPath, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.isDirectory() && !entry.name.startsWith("_") && entry.name !== "[slug]") {
				const categoryPath = path.join(docsPath, entry.name);
				const files: DocFile[] = [];

				// ディレクトリ内のmdファイルを読み込む
				try {
					const categoryEntries = fs.readdirSync(categoryPath, { withFileTypes: true });
					for (const fileEntry of categoryEntries) {
						if (fileEntry.isFile() && fileEntry.name.endsWith(".md")) {
							const fileName = fileEntry.name;
							const slug = generateSlug(fileName);
			  
							// ファイル名を表示用に整形（アンダースコアをスペースに、各単語の先頭を大文字に）
							const displayName = fileName
								.replace(/\.md$/, "")
								.replace(/_/g, " ")
								.replace(/\b\w/g, (char) => char.toUpperCase());

							files.push({
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
					files: files.sort((a, b) => a.name.localeCompare(b.name)),
				});
			}
		}
	} catch (error) {
		console.error("Error reading docs directory:", error);
	}

	return categories.sort((a, b) => a.name.localeCompare(b.name));
};

