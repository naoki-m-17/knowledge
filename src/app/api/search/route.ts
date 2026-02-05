import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDocsStructure } from "@/lib/docs-server";

export interface SearchResult {
	category: string;
	article: {
		name: string;
		slug: string;
		path: string;
	};
	matches: {
		text: string;
		context: string;
		lineNumber: number;
	}[];
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");

	if (!query || query.trim().length === 0) {
		return NextResponse.json({ results: [] });
	}

	const searchTerm = query.toLowerCase();
	const results: SearchResult[] = [];
	const categories = getDocsStructure();

	for (const category of categories) {
		for (const article of category.articles) {
			const filePath = path.join(
				process.cwd(),
				"public/docs",
				category.name,
				`${article.slug}.md`
			);

			try {
				const content = fs.readFileSync(filePath, "utf-8");
				const lines = content.split("\n");
				const matches: SearchResult["matches"] = [];

				// 各行を検索
				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					if (line.toLowerCase().includes(searchTerm)) {
						// 前後3行を取得してコンテキストを作成
						const start = Math.max(0, i - 2);
						const end = Math.min(lines.length, i + 3);
						const context = lines.slice(start, end).join("\n");

						// マッチした行のテキストを取得
						const matchText = line.trim();

						matches.push({
							text: matchText,
							context: context,
							lineNumber: i + 1,
						});
					}
				}

				if (matches.length > 0) {
					results.push({
						category: category.displayName,
						article: article,
						matches: matches,
					});
				}
			} catch (error) {
				console.error(`Error reading article ${article.path}:`, error);
			}
		}
	}

	return NextResponse.json({ results });
}

