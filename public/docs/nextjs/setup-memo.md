# Next.js 環境構築メモ (2026/02/03)

## プロジェクト作成コマンド
`pnpm create next-app@latest hoge`

## セットアップ時の選択肢とその意図
エンジニア 松永尚樹による判断の記録。

- **Would you like to use TypeScript? → Yes**
    - 型安全性を確保し、フロントエンドエンジニアとしての品質を担保するため。
    - TypeScript の基本的な概念については、[JavaScript / TypeScript の共通ルールと文法](../javascript/js-ts-basics.md) を参照してください。
- **Would you like to use ESLint? → Yes**
    - コードの品質を一定に保ち、構文エラーを自動検知するため。
- **Would you like to use Tailwind CSS? → No**
    - 長期的なメンテナンス性と技術的負債のリスクを考慮。標準的なCSS構成を選択。
- **Would you like to use `src/` directory? → Yes**
    - 設定ファイルとソースコードを分離し、プロジェクトの見通しを良くするため。
- **Would you like to use App Router? → Yes**
    - Next.jsの最新標準。サーバーコンポーネント等の恩恵をフルに受けるため。
- **Would you like to use React Compiler? → Yes**
    - React 19の最新機能。パフォーマンス最適化を自動化し、可読性を両立させるため。
- **Would you like to customize the import alias (@/* by default)? → No**
    - デフォルトの `@/*` が最も一般的であり、直感的であるため。

## 脆弱性（CVE-2025-55182）への対応
- **背景:** Next.js 15.1.4 未満に存在した重大な脆弱性。
- **対応:** 本プロジェクトでは対策済みの Next.js 16.1.6 を採用し、安全性を保証。

## package.json の修正
- **"name": "knowledge"**: 公開リポジトリでは、リポジトリ名、プロジェクト名にドメインを含めない。
- **"lint": "next lint"**: Next.js に特化したチェックを行うための修正。
