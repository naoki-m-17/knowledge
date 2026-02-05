# Knowledge Base

CyPassのナレッジベースシステム。技術ドキュメントや開発メモを管理・検索できるWebアプリケーションです。

## 技術スタック

- **Next.js**: 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: ^5
- **パッケージマネージャー**: pnpm
- **スタイリング**: SCSS
- **マークダウン**: react-markdown

## 主な機能

- **全文検索**: 記事内のテキストを検索し、マッチした箇所をハイライト表示
- **マークダウン表示**: 記事をマークダウン形式で記述・表示
- **コードブロック**: コードブロックにコピーボタンを追加
- **サイドバーナビゲーション**: カテゴリーと記事の階層構造を表示（モバイル対応）
- **ドキュメント順序設定**: カテゴリーと記事の表示順序を設定ファイルで管理

## プロジェクト構成

```
.
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── api/                # API Routes
│   │   │   └── search/         # 検索API
│   │   ├── docs/               # ナレッジベースの本体（ルーティングとコンテンツ）
│   │   │   └── [category]/     # カテゴリー別ルーティング
│   │   │       └── [slug]/     # 記事別ルーティング
│   │   └── page.tsx            # ホームページ（検索UI）
│   ├── components/             # 共通UIコンポーネント
│   │   ├── Sidebar.tsx         # サイドバーナビゲーション
│   │   └── CodeBlock.tsx      # コードブロック（コピー機能付き）
│   ├── lib/                    # ユーティリティ関数
│   │   ├── docs-server.ts      # サーバーサイドのドキュメント処理
│   │   ├── docs-client.ts      # クライアントサイドのドキュメント処理
│   │   └── docs-order.config.ts # ドキュメント順序設定
│   └── assets/                 # 静的資産
│       └── images/             # 画像ファイル
├── public/
│   └── docs/                   # マークダウンファイル
│       ├── environment-setup/  # 環境構築関連
│       ├── firebase/           # Firebase関連
│       ├── github/             # Git/GitHub関連
│       ├── javascript/         # JavaScript/TypeScript関連
│       ├── nextjs/             # Next.js関連
│       └── react/              # React関連
└── apphosting.yaml             # Firebase App Hosting用設定
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

### ドキュメントカテゴリー

- **環境構築** (`environment-setup`): 開発環境のセットアップ手順
- **Firebase** (`firebase`): Firebase関連の設定と運用
- **GitHub** (`github`): Git/GitHubの操作手順
- **JavaScript** (`javascript`): JavaScript/TypeScriptの基礎知識
- **Next.js** (`nextjs`): Next.jsの機能と使い方
- **React** (`react`): Reactの基礎とベストプラクティス

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

### 本番環境での起動

```bash
pnpm start
```

## ドキュメントの追加方法

1. `public/docs/[カテゴリー名]/` ディレクトリに `.md` ファイルを追加
2. ファイル名はハイフン区切りで命名（例: `my-article.md`）
3. `src/lib/docs-order.config.ts` にカテゴリーと記事の順序を追加（任意）

## 検索機能

ホームページ（`/`）で記事の全文検索が可能です。検索結果には：
- マッチした記事のタイトルとカテゴリー
- マッチした行番号と前後のコンテキスト
- 検索語のハイライト表示

が表示されます。









