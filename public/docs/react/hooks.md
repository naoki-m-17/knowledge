# React Hooks（フック）

## useState フック

画面内の「状態（データ）」を管理する。小文字始まり、`{}` でインポート。

コンポーネント内の「状態」を管理する。値が変わると React が検知し、画面の必要な部分だけを再描画する。

**注意**: `{}` でのインポートは JavaScript の名前付きインポート構文です。詳細については、[{} でのインポート文法](../javascript/import-syntax.md) を参照してください。

### 基本的な使い方

```typescript
import { useState } from "react";

const Component = () => {
	const [count, setCount] = useState(0);
	
	return (
		<div>
			<p>{count}</p>
			<button onClick={() => setCount(count + 1)}>増やす</button>
		</div>
	);
};
```

## useEffect フック

画面が表示された後や URL が変わった後に「処理を実行」する。小文字始まり、`{}` でインポート。

ブラウザに描画が完了した「後」に実行される。API 取得、URL 監視（usePathname との連携）、タイマー設定などに使用。

**注意**: `usePathname` は Next.js の機能です。Next.js の機能については、[Next.js の独自機能と便利ツール](../nextjs/nextjs-features.md) を参照してください。

### 基本的な使い方

```typescript
import { useEffect } from "react";

const Component = () => {
	useEffect(() => {
		// コンポーネントがマウントされた後に実行される処理
		console.log("コンポーネントが表示されました");
		
		// クリーンアップ関数（オプション）
		return () => {
			console.log("コンポーネントがアンマウントされました");
		};
	}, []); // 依存配列（空の場合は初回のみ実行）
	
	return <div>...</div>;
};
```

### 依存配列の役割

依存配列に値を指定すると、その値が変更されたときに `useEffect` が再実行されます：

```typescript
useEffect(() => {
	// pathname が変更されるたびに実行される
	console.log("パスが変更されました:", pathname);
}, [pathname]);
```

## useState / useEffect とハイドレーションの仕組み

### ハイドレーション（Hydration）との関係

Next.js はサーバーで作成した静的 HTML をブラウザに送り、その後 JavaScript（React）が「命を吹き込む」工程。

サーバー側には「今の URL」や「ブラウザの状態」がない。

**useEffect はハイドレーション完了後（ブラウザ側）でしか動かない**ため、サーバーとクライアントの表示の食い違いを防ぐ重要な役割を持つ。

### 実際の例

Sidebar の例：サーバーでは「全部閉じた状態」で HTML を作り、ブラウザでハイドレーションが終わった瞬間に useEffect が URL を見て「該当カテゴリを開く」という動作になる。

詳細については、[Next.js の "use client" とレンダリング](../nextjs/use-client-rendering.md) を参照してください。

