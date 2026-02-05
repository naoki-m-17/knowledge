// サイドバーのカテゴリーと記事の表示順序と日本語名を定義する設定ファイル

export interface DocsConfig {
	categories: Array<{
		name: string; // slug（カテゴリー）
		displayName: string; // カテゴリー名
		articles: Array<{
			slug: string; // slug（記事）
			displayName: string; // 記事名
		}>;
	}>;
}

export const docsConfig: DocsConfig = {
	categories: [
		{
			name: "environment-setup",
			displayName: "環境構築",
			articles: [
				{ slug: "m5-clean-arch", displayName: "M5 Mac クリーンアーキテクチャ" },
				{ slug: "homebrew-shell-setup", displayName: "Homebrew・Shell セットアップ" },
				{ slug: "nodejs-setup", displayName: "Node.js セットアップ" },
				{ slug: "firebase-setup", displayName: "Firebase セットアップ" },
				{ slug: "maintenance", displayName: "メンテナンス" },
			],
		},
		{
			name: "hardware",
			displayName: "ハードウェア",
			articles: [
				{ slug: "m4-pro-vs-m5-comparison", displayName: "M4 Pro vs M5 比較" },
				{ slug: "core-architecture", displayName: "コアアーキテクチャ" },
				{ slug: "memory-bandwidth", displayName: "メモリ帯域幅" },
				{ slug: "multitasking", displayName: "マルチタスク" },
				{ slug: "power-efficiency", displayName: "電力効率" },
				{ slug: "gpu-ai-acceleration", displayName: "GPU・AI アクセラレーション" },
				{ slug: "engineer-perspective", displayName: "エンジニア視点" },
				{ slug: "recommendations", displayName: "推奨事項" },
			],
		},
		{
			name: "firebase",
			displayName: "Firebase",
			articles: [
				{ slug: "secret-manager-setup", displayName: "Secret Manager セットアップ" },
				{ slug: "next-image-404", displayName: "Next.js Image 404 エラー" },
				{ slug: "next-image-diagnosis", displayName: "Next.js Image 診断" },
				{ slug: "next-image-fix", displayName: "Next.js Image 修正" },
			],
		},
		{
			name: "github",
			displayName: "GitHub",
			articles: [
				{ slug: "workflow", displayName: "ワークフロー" },
			],
		},
		{
			name: "javascript",
			displayName: "JavaScript",
			articles: [
				{ slug: "js-ts-basics", displayName: "JavaScript・TypeScript 基礎" },
				{ slug: "import-syntax", displayName: "import 構文" },
			],
		},
		{
			name: "nextjs",
			displayName: "Next.js",
			articles: [
				{ slug: "setup-memo", displayName: "セットアップメモ" },
				{ slug: "nextjs-features", displayName: "Next.js 機能" },
				{ slug: "use-client-rendering", displayName: "use client レンダリング" },
			],
		},
		{
			name: "react",
			displayName: "React",
			articles: [
				{ slug: "react-basics", displayName: "React 基礎" },
				{ slug: "props", displayName: "プロップス" },
				{ slug: "hooks", displayName: "フック" },
				{ slug: "naming-conventions", displayName: "命名規則" },
			],
		},
	],
};

