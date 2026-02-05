# {} でのインポート文法

React パッケージ内の「数ある道具の中の一つ」を指名して呼ぶための JS 文法。

React の基本的な概念については、[React の基本ルールと慣習](../react/react-basics.md) を参照してください。

## 名前付きインポート（Named Import）

`{}` を使ったインポートは、モジュールから特定の名前のエクスポートを取得する方法です。

### React での例

```typescript
import { FC, useState, useEffect } from "react";
```

これは `react` モジュールから `FC`、`useState`、`useEffect` という名前のエクスポートを取得しています。

### 一般的な使い方

```typescript
// 複数の名前付きエクスポートをインポート
import { Component1, Component2, utility } from "./module";

// デフォルトエクスポートと名前付きエクスポートを組み合わせ
import DefaultExport, { NamedExport } from "./module";
```

## デフォルトインポートとの違い

```typescript
// デフォルトインポート（{} なし）
import Sidebar from "@/components/Sidebar";

// 名前付きインポート（{} あり）
import { FC, useState } from "react";
```

- **デフォルトインポート**: モジュールが `export default` でエクスポートしたものを取得
- **名前付きインポート**: モジュールが `export` でエクスポートした特定の名前を取得

JavaScript/TypeScript の基本的な文法や命名規則については、[JavaScript / TypeScript の共通ルールと文法](./js-ts-basics.md) を参照してください。

