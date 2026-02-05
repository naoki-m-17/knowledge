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

### ファイル名の命名規則

記事ファイル（`.md`ファイル）は**ハイフン区切り**で命名してください（例: `secret-manager-setup.md`）。

- ファイル名とslugが一致するため、管理が簡単
- slugはファイル名から`.md`を削除するだけ
- 表示名は自動的に生成されます（ハイフンをスペースに変換し、各単語の先頭を大文字化）

### マークダウン内のリンクの書き方

記事内で他の記事へのリンクを書く際は、**`.md`拡張子を含めて書いても問題ありません**。システムが自動的に正しいルートに変換します。

**記事を新規作成する際は、関連する他の記事へのリンクを適宜使用してください。** 記事間の関連性を明確にし、ナレッジベース全体のナビゲーション性を向上させることができます。リンク機能は正常に動作するため、積極的に活用してください。

例：
- 同じカテゴリ内: `[プロップス](./props.md)`
- 別のカテゴリ: `[Next.jsの記事](../nextjs/use-client-rendering.md)`
- 絶対パス: `[記事](/docs/react/props.md)`

**注意**: リンクは`.md`付きで書いても、`.md`なしで書いても、どちらでも動作します。システムが自動的に`.md`を削除して正しいルート（`/docs/[category]/[slug]`）に変換します。

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









