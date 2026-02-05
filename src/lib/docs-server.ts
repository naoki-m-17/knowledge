import fs from "fs";
import path from "path";
import { cache } from "react";
import type { DocArticle, DocCategory } from "./docs-client";
import { formatDisplayName } from "./docs-client";
import { docsConfig } from "./docs-order.config";

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

// docs-order.config.ts に基づいてソート
function sortByOrder<T>(
	items: T[],
	order: string[],
	getKey: (item: T) => string,
	itemName: string
): T[] {
	const itemMap = new Map<string, T>();
	const orderedItems: T[] = [];
	const unorderedItems: T[] = [];

	// アイテムをマップに格納
	for (const item of items) {
		const key = getKey(item);
		itemMap.set(key, item);
	}

	// 順序設定に従って順番に追加
	for (const key of order) {
		const item = itemMap.get(key);
		if (item) {
			orderedItems.push(item);
			itemMap.delete(key);
		} else if (process.env.NODE_ENV === "development") {
			console.warn(
				`[docs-order] 順序設定に存在しない${itemName}が見つかりました: "${key}"。末尾に自動追加されます。`
			);
		}
	}

	// 順序設定にないアイテムを末尾に追加
	for (const [key, item] of itemMap.entries()) {
		unorderedItems.push(item);
		if (process.env.NODE_ENV === "development") {
			console.warn(
				`[docs-order] ${itemName} "${key}" が順序設定ファイルにありません。末尾に自動追加されます。順序設定ファイル（docs-order.config.ts）に追加することをお勧めします。`
			);
		}
	}

	return [...orderedItems, ...unorderedItems];
}

// docs配下のディレクトリ構造を読み込む（cache関数でメモ化）
export const getDocsStructure = cache((): DocCategory[] => {
	const docsPath = path.join(process.cwd(), "public/docs");
	const categoriesMap = new Map<string, DocCategory>();

	try {
		const entries = fs.readdirSync(docsPath, { withFileTypes: true });

		// ファイルシステムからカテゴリーと記事を読み込む
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
							// フォールバック用の表示名を生成
							const fallbackDisplayName = formatDisplayName(articleName.replace(/\.md$/, ""));

							articles.push({
								name: fallbackDisplayName, // 後で設定ファイルから上書きされる可能性がある
								slug: slug,
								path: `/docs/${entry.name}/${slug}`,
							});
						}
					}
				} catch (error) {
					console.error(`Error reading category ${entry.name}:`, error);
				}

				// nameは英語名のまま（Sidebarでキーとして使用されるため）
				categoriesMap.set(entry.name, {
					name: entry.name,
					displayName: entry.name, // 後で設定ファイルから上書きされる可能性がある
					path: `/docs/${entry.name}`,
					articles: articles,
				});
			}
		}
	} catch (error) {
		console.error("Error reading docs directory:", error);
	}

	// sortByOrder でのソートを適用
	const orderedCategories: DocCategory[] = [];
	const unorderedCategories: DocCategory[] = [];

	// 順序設定に従ってカテゴリーを並べる（設定ファイルの記述順でソート）
	for (const categoryConfig of docsConfig.categories) {
		const category = categoriesMap.get(categoryConfig.name);
		if (category) {
			// カテゴリの日本語名を設定
			category.displayName = categoryConfig.displayName;

			// 記事の日本語名を設定ファイルから設定（sortByOrderの前に設定）
			const articleDisplayNameMap = new Map(
				categoryConfig.articles.map((art) => [art.slug, art.displayName])
			);
			for (const article of category.articles) {
				const displayName = articleDisplayNameMap.get(article.slug);
				if (displayName) {
					article.name = displayName;
				}
			}

			// 記事の順序も適用（設定ファイルの記述順でソート）
			const articleSlugs = categoryConfig.articles.map((art) => art.slug);
			category.articles = sortByOrder(
				category.articles,
				articleSlugs,
				(article) => article.slug,
				`記事（カテゴリー: ${categoryConfig.name}）`
			);

			orderedCategories.push(category);
			categoriesMap.delete(categoryConfig.name);
		} else if (process.env.NODE_ENV === "development") {
			console.warn(
				`[docs-order] 順序設定に存在しないカテゴリーが見つかりました: "${categoryConfig.name}"。このカテゴリーはファイルシステムに存在しません。`
			);
		}
	}

	// フォールバック（順序設定にないカテゴリー・記事を末尾に追加）
	for (const [categoryName, category] of categoriesMap.entries()) {
		// フォールバック用の表示名を設定（既に設定されている場合はそのまま）
		if (category.displayName === categoryName) {
			category.displayName = formatDisplayName(categoryName);
		}
		unorderedCategories.push(category);
		if (process.env.NODE_ENV === "development") {
			console.warn(
				`[docs-order] カテゴリー "${categoryName}" が順序設定ファイルにありません。末尾に自動追加されます。順序設定ファイル（docs-order.config.ts）に追加することをお勧めします。`
			);
		}
	}

	return [...orderedCategories, ...unorderedCategories];
});