export interface DocFile {
	name: string;
	slug: string;
	path: string;
}

export interface DocCategory {
	name: string;
	path: string;
	files: DocFile[];
}

/**
* カテゴリ名を表示用に変換（クライアントサイドで使用可能）
*/
export const formatCategoryName = (name: string): string => {
	const nameMap: Record<string, string> = {
		firebase: "Firebase",
		github: "GitHub",
		nextjs: "Next.js",
		react: "React",
		javascript: "JavaScript / TypeScript",
	};
	return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
};

