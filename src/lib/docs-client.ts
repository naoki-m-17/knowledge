export interface DocArticle {
	name: string;
	slug: string;
	path: string;
}

export interface DocCategory {
	name: string; // slug（英語）
	displayName: string; // 日本語表示名
	path: string;
	articles: DocArticle[];
}

// 名前を表示用に変換（カテゴリ名・記事名）
export const formatDisplayName = (name: string): string => {
	return name
		.replace(/[_-]/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};
