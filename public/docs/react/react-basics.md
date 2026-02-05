# React の基本ルールと慣習

このドキュメントは、React に関する基本的な概念とルールの概要です。詳細については、以下の各記事を参照してください。

## 関連記事

- [プロップス（Props）と FC 型](./props.md) - プロップスと FC 型についての詳細
- [React Hooks（フック）](./hooks.md) - useState と useEffect についての詳細
- [React の命名規則](./naming-conventions.md) - コンポーネント名の命名規則について
- [Next.js App Router: "use client" とレンダリング](../nextjs/use-client-rendering.md) - "use client" とハイドレーションについての詳細
- [{} でのインポート文法](../javascript/import-syntax.md) - 名前付きインポートについての詳細

## 概要

React は、ユーザーインターフェースを構築するための JavaScript ライブラリです。コンポーネントベースのアーキテクチャを採用しており、再利用可能な UI 部品を作成できます。

主な概念：
- **コンポーネント**: UI の部品を表す関数やクラス
- **プロップス**: 親コンポーネントから子コンポーネントへ渡すデータ
- **状態（State）**: コンポーネント内で管理するデータ
- **フック（Hooks）**: 関数コンポーネントで状態や副作用を扱うための機能

