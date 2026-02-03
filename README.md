# Knowledge Base (Prototype)

> **このリポジトリはAIによって初期構築されたプロトタイプであり、環境整備中です。**

## 技術スタック

- **Next.js**: 16.1.6
- **React**: 19.2.3
- **TypeScript**: ^5
- **パッケージマネージャー**: pnpm
- **スタイリング**: SCSS

## プロジェクト構成

```
.
├── src/
│   ├── app/                # Next.js 16 App Router
│   │   ├── docs/           # ナレッジベースの本体（ルーティングとコンテンツ）
│   │   │   ├── firebase/   # Firebase関連
│   │   │   ├── nextjs/     # Next.js環境構築の記録
│   │   │   └── github/     # Git/GitHubの操作手順メモ
│   │   └── ...
│   ├── components/         # 共通UIパーツ（Button等）
│   ├── lib/                # ユーティリティ関数やFirebaseの初期化
│   └── types/              # TypeScriptの型定義
├── public/                 # 静的資産
└── apphosting.yaml         # Firebase App Hosting用設定
```

## ドキュメント

### Firebase関連
- [Firebase関連ドキュメント](/docs/firebase)
  - [Firebase Secret Manager セットアップ](/docs/firebase/SECRET_MANAGER_SETUP.md)

### Next.js関連
- [Next.js環境構築の記録](/docs/nextjs)
  - [Next.js環境構築メモ](/docs/nextjs/setup_memo.md)

### Git/GitHub関連
- [Git/GitHubの操作手順](/docs/github)
  - [Git/GitHub操作手順](/docs/github/workflow.md)

## 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- pnpmがインストールされていること

### インストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### ビルド

```bash
pnpm build
```









