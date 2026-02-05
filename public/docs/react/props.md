# プロップス（Props）と FC 型

## プロップスとは

プロップス（props）は、**親コンポーネントから子コンポーネントへ渡すデータ**です。関数の引数のような役割を果たします。これは **React の基本機能**です。

### 概念イメージ

```
親コンポーネント（layout.tsx）
    ↓ データを渡す
子コンポーネント（Sidebar.tsx）
```

親コンポーネントが持っているデータを、子コンポーネントに「渡す」ことで、子コンポーネントはそのデータを使って表示や処理を行います。

### 実際の例：layout.tsx → Sidebar.tsx

**親コンポーネント（layout.tsx）**でデータを準備し、子コンポーネントに渡します：

```typescript
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
	const categories = getDocsStructure(); // データを取得

	return (
		<html lang="ja">
			<body>
				<Sidebar categories={categories} /> {/* データを渡す */}
				<main>
					{children}
				</main>
			</body>
		</html>
	);
};
```

**子コンポーネント（Sidebar.tsx）**でプロップスを受け取ります：

```typescript
interface SidebarProps {
	categories: DocCategory[]; // プロップスの型定義
}

const Sidebar: FC<SidebarProps> = ({ categories }) => {
```

**注意**: `interface` は TypeScript の機能です。型定義の詳細については、[JavaScript / TypeScript の共通ルールと文法](../javascript/js-ts-basics.md) を参照してください。
	// categories を使って処理を行う
	return (
		<nav className="sidebarMenu">
			{categories.map((category) => {
				// ...
			})}
		</nav>
	);
};
```

### なぜプロップスを書くのか

1. **データの受け渡し**
   - 親コンポーネントが持つデータを子コンポーネントで使えるようにする
   - コンポーネント間で情報を共有する仕組み

2. **再利用性の向上**
   - 同じコンポーネントに異なるデータを渡すことで、様々な場面で使い回せる
   - 例：`<Sidebar categories={categories1} />` と `<Sidebar categories={categories2} />` で異なるデータを表示

3. **型安全性（TypeScript）**
   - プロップスの型を定義することで、間違ったデータが渡されることを防ぐ
   - IDE の補完機能が働き、開発効率が向上する

### プロップスがない場合

プロップスを受け取らないコンポーネントもあります：

```typescript
const Home: FC = () => {
	return (
		<div className="home">
			<h1>My Knowledge Base</h1>
		</div>
	);
};
```

この場合、親からデータを受け取る必要がないため、プロップスは定義しません。

## FC 型 (TypeScript)

### FC とは

`FC` は **Functional Component** の略で、「React の関数コンポーネント」という型定義です。TypeScript でコンポーネントの型を明確にするために使用します。

**FC でプロップスを渡していく機能は React の機能**です。`FC` 型自体は TypeScript の型定義ですが、プロップスを使って親から子へデータを渡す仕組み自体は React が提供する基本機能です。

- TypeScript の型定義の基本については、[JavaScript / TypeScript の共通ルールと文法](../javascript/js-ts-basics.md) を参照してください。
- React の命名規則については、[React の命名規則](./naming-conventions.md) も参照してください。

### 基本的な使い方

プロップスがある場合：

```typescript
interface SidebarProps {
	categories: DocCategory[];
}

const Sidebar: FC<SidebarProps> = ({ categories }) => {
	// ...
};
```

プロップスがない場合：

```typescript
const Home: FC = () => {
	// ...
};
```

### FC の効果

1. **型安全性の提供**
   - TypeScript でコンポーネントの型を明確にする
   - プロップスの型チェックが働く

2. **戻り値の型推論**
   - `FC` を使うと、戻り値は `React.ReactElement | null` として扱われる
   - JSX を返す関数であることを型で示せる

3. **IDE のサポート**
   - TypeScript がコンポーネントとして認識し、適切な補完やエラー検出が働く

### プロップスがない場合も FC を書くメリット

プロップスがない場合でも `FC` を書くことで、以下のメリットがあります：

1. **型の明示性**
   - この関数が React コンポーネントであることを型で明確に示せる
   - コードの意図が明確になり、可読性が向上する

2. **一貫性の維持**
   - プロジェクト全体で `FC` を使うことで、コードスタイルが統一される
   - チーム開発での混乱を防げる

3. **将来の拡張性**
   - 後でプロップスが必要になった際、型定義を追加しやすい
   - `FC` → `FC<Props>` への変更が容易

4. **IDE のサポート**
   - TypeScript がコンポーネントとして認識し、適切な補完やエラー検出が働く

ただし、必須ではありません。TypeScript は戻り値の型を推論するため、`FC` なしでも動作します。

