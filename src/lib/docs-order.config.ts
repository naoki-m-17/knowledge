// サイドバーのカテゴリーと記事の表示順序を定義する設定ファイル
// 開発時に順序設定にない項目がある場合、ターミナル（Next.js開発サーバーを実行しているターミナル）に警告を表示した上で、カテゴリーや記事は自動的に末尾に追加されます

export interface DocsOrderConfig {
	categories: Array<{
		name: string; // カテゴリー名
		articles: string[]; // 記事のslug
	}>;
}

export const docsOrderConfig: DocsOrderConfig = {
	categories: [
		{
			name: "environment-setup",
			articles: [
				"m5-clean-arch",
				"homebrew-shell-setup",
				"nodejs-setup",
				"firebase-setup",
				"maintenance",
			],
		},
		{
			name: "hardware",
			articles: [
				"m4-pro-vs-m5-comparison",
				"core-architecture",
				"memory-bandwidth",
				"multitasking",
				"power-efficiency",
				"gpu-ai-acceleration",
				"engineer-perspective",
				"recommendations",
			],
		},
		{
			name: "firebase",
			articles: [
				"secret-manager-setup",
				"next-image-404",
				"next-image-diagnosis",
				"next-image-fix",
			],
		},
		{
			name: "github",
			articles: [
				"workflow",
			],
		},
		{
			name: "javascript",
			articles: [
				"js-ts-basics",
				"import-syntax",
			],
		},
		{
			name: "nextjs",
			articles: [
				"setup-memo",
				"nextjs-features",
				"use-client-rendering",
			],
		},
		{
			name: "react",
			articles: [
				"react-basics",
				"props",
				"hooks",
				"naming-conventions",
			],
		},
	],
};

