# React の命名規則

## コンポーネント名は大文字で始める（絶対ルール）

コンポーネント（Sidebar 等）は大文字で始める。

React は `<sidebar>`（小文字）なら HTML 標準タグ、`<Sidebar>`（大文字）なら自作部品と判断するため。

### 正しい例

```typescript
const Sidebar = () => {
	return <aside>...</aside>;
};

// 使用時
<Sidebar />
```

### 間違った例

```typescript
const sidebar = () => {
	return <aside>...</aside>;
};

// これは HTML の <sidebar> タグとして解釈される（存在しないタグ）
<sidebar />
```

## 変数スタイル (const) での定義

【区分：言語 + React の慣習】

理由：JS の進化により「書き換え不可能な関数」として定義可能になった。

React での意味：`FC` 型を適用しやすいため、現在の React 開発では `function` より `const` がモダンとされる。

**注意**: `const` での関数定義は JavaScript の機能です。JavaScript の基本的な文法については、[JavaScript / TypeScript の共通ルールと文法](../javascript/js-ts-basics.md) を参照してください。

`FC` 型の詳細については、[プロップス（Props）と FC 型](./props.md) を参照してください。

### 推奨される書き方

```typescript
const Component: FC = () => {
	return <div>...</div>;
};
```

### 従来の書き方（動作するがモダンではない）

```typescript
function Component() {
	return <div>...</div>;
}
```

