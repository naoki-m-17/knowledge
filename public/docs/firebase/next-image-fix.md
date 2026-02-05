# Firebase App Hosting: Next.js Image 404エラーの解決策と実装パターン

## 概要

この記事では、Firebase App HostingでNext.jsのImageコンポーネントが404エラーになる問題に対する実践的な解決策と、推奨される実装パターン、トラブルシューティングを解説します。

関連記事：[概要と画像配信の仕組み](./next-image-404.md) | [404エラーの原因と診断方法](./next-image-diagnosis.md)

## 解決策

### 解決策1: `src/assets`に画像を配置して`import`する（推奨）

**最も確実で推奨される方法です。**

#### 手順

1. **画像を`src/assets`ディレクトリに移動**

```bash
# プロジェクトルートから実行
mkdir -p src/assets/images
mv public/logo.png src/assets/images/logo.png
```

2. **コンポーネントで`import`して使用**

```tsx
import Image from 'next/image';
import logo from '@/assets/images/logo.png';

export default function Header() {
  return (
    <Image
      src={logo}  // importした画像を直接指定
      alt="Logo"
      // width/heightを明示しなくても、importした画像なら自動で計算される
    />
  );
}
```

#### メリット

- ✅ **ビルド時に画像がバンドルに含まれる：** 確実にデプロイされる
- ✅ **型安全性：** TypeScriptが画像の存在をチェック
- ✅ **パフォーマンス：** ビルド時に最適化されるため、実行時のオーバーヘッドがない
- ✅ **レイアウトシフト防止：** ビルド時に画像サイズが確定するため、CLSを防ぎやすい
- ✅ **Firebase App Hostingで確実に動作：** デプロイ環境の影響を受けない

#### デメリット

- ❌ **ビルド時間の増加：** 画像が多い場合、ビルド時間が長くなる可能性がある
- ❌ **バンドルサイズの増加：** 画像がJavaScriptバンドルに含まれる（ただし、Next.jsが最適化する）

### 解決策2: `public`ディレクトリを使用する場合の対処法

どうしても`public`ディレクトリを使用したい場合の対処法です。

#### 2.1: パスの確認と修正

**よくある間違い：**
```tsx
// ❌ 間違い：publicという文字列をパスに含めている
<Image src="/public/logo.png" alt="Logo" />
```

**正しい指定：**
```tsx
// ✅ 正しい：publicディレクトリはルート（/）として公開される
<Image src="/logo.png" alt="Logo" width={100} height={40} />
```

#### 2.2: `next.config.ts`の確認

`next.config.ts`で`basePath`や`output`の設定を確認します。

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePathが設定されている場合、画像パスも含める必要がある
  // basePath: '/app',  // この場合、src="/app/logo.png"とする
  
  // output: 'standalone'は通常不要（Firebase App Hostingでは）
  // output: 'standalone',
  
  reactCompiler: true,
};

export default nextConfig;
```

#### 2.3: `apphosting.yaml`の確認

ビルドコマンドが正しく設定されているか確認します。

```yaml
# apphosting.yaml
build:
  commands:
    - pnpm install
    - pnpm build  # これでpublicディレクトリが正しく処理される
```

#### 2.4: 静的ファイルの配信設定

Firebase App Hostingでは、`public`ディレクトリの内容は自動的に静的ファイルとして配信されますが、明示的に設定することもできます。

**注意：** Firebase App Hostingでは、通常は追加の設定は不要です。問題が発生する場合は、上記の解決策1（`src/assets`に配置）を推奨します。

### 解決策3: `unoptimized`オプションの使用（一時的な対処）

Image Optimizerをバイパスして、画像をそのまま配信する方法です。

```tsx
<Image
  src="/logo.png"
  alt="Logo"
  width={100}
  height={40}
  unoptimized  // 最適化を無効化
/>
```

#### メリット

- ✅ **簡単に実装できる：** 既存のコードを最小限変更するだけ
- ✅ **Image Optimizerの問題を回避：** ランタイム環境の制約を回避

#### デメリット

- ❌ **パフォーマンスへの影響：** 画像が最適化されないため、ファイルサイズが大きい
- ❌ **フォーマット変換なし：** WebPやAVIFへの変換が行われない
- ❌ **レスポンシブ画像なし：** デバイスに応じた最適なサイズの画像が配信されない

**推奨：** ロゴなどの小さな画像（数KB程度）であれば、`unoptimized`でもパフォーマンスへの影響は無視できるレベルです。ただし、根本的な解決策としては推奨しません。

## 推奨される実装パターン

### パターン1: UIパーツ（ロゴ、アイコンなど）

**推奨：** `src/assets`に配置して`import`する

```tsx
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import iconHome from '@/assets/images/icons/home.svg';

export default function Header() {
  return (
    <header>
      <Image src={logo} alt="Logo" />
      <Image src={iconHome} alt="Home" width={24} height={24} />
    </header>
  );
}
```

**理由：**
- ビルド時に確実に含まれる
- 型安全性が確保される
- パフォーマンスが最適化される

### パターン2: コンテンツ画像（ブログ記事の写真など）

**推奨：** 外部ストレージ（Firebase Storage、Cloud Storageなど）を使用

```tsx
<Image
  src="https://storage.googleapis.com/your-bucket/image.jpg"
  alt="Article image"
  width={800}
  height={600}
/>
```

**理由：**
- 画像が多くてもビルド時間に影響しない
- 動的に追加・削除できる
- CDN経由で高速配信できる

### パターン3: 静的な数が多い画像

**推奨：** `public`ディレクトリに配置（ただし、Firebase App Hostingでは注意が必要）

```tsx
<Image
  src="/gallery/image-001.jpg"
  alt="Gallery image"
  width={400}
  height={300}
/>
```

**理由：**
- 画像が多くてもビルド時間に影響しない
- 動的にパスを生成できる

**注意：** Firebase App Hostingで問題が発生する場合は、解決策1（`src/assets`）を検討してください。

## トラブルシューティング

### エラー: "Failed to load image" または 404エラー

**原因：** 画像パスが正しくない、または画像がデプロイされていない

**解決方法：**
1. 画像パスを確認（`/public/`を含めていないか）
2. 直接アクセステストを実行（[原因と診断方法](./next-image-diagnosis.md)を参照）
3. `src/assets`に移動して`import`する方法に切り替え

### エラー: Image Optimizerのエラー

**原因：** Image Optimizerサーバーが正しく動作していない

**解決方法：**
1. `unoptimized`オプションで一時的に回避
2. `src/assets`に移動して`import`する方法に切り替え（推奨）

### エラー: ビルド時のエラー

**原因：** 画像ファイルが存在しない、またはパスが間違っている

**解決方法：**
1. 画像ファイルの存在を確認
2. `import`を使用している場合、TypeScriptがエラーを表示するので修正
3. パスのエイリアス設定（`@/assets`など）を確認

### パフォーマンスの問題

**症状：** 画像の読み込みが遅い、またはレイアウトシフトが発生する

**解決方法：**
1. `width`と`height`を明示的に指定
2. `priority`オプションを使用（Above the foldの画像）
3. `src/assets`に移動して`import`する方法に切り替え（ビルド時にサイズが確定）

```tsx
<Image
  src={logo}
  alt="Logo"
  priority  // Above the foldの画像に設定
/>
```

## チェックリスト

Firebase App HostingでNext.jsの画像を正しく表示するためのチェックリスト：

### ビルド前

- [ ] 画像ファイルが正しい場所に配置されている
- [ ] `next.config.ts`の設定を確認（`basePath`、`output`など）
- [ ] `apphosting.yaml`のビルドコマンドを確認

### デプロイ後

- [ ] 直接画像URLにアクセスして確認（`https://your-domain.com/logo.png`）
- [ ] Imageコンポーネントで画像が表示されるか確認
- [ ] ブラウザの開発者ツールでネットワークエラーを確認
- [ ] ビルドログにエラーがないか確認

### 問題が発生した場合

- [ ] `unoptimized`オプションで一時的に回避できるか確認
- [ ] `src/assets`に移動して`import`する方法に切り替えを検討
- [ ] [原因と診断方法](./next-image-diagnosis.md)の診断フローを実行
- [ ] Firebase App Hostingのドキュメントを確認

## まとめ

Firebase App HostingでNext.jsの画像を正しく表示するための推奨事項：

1. **UIパーツ（ロゴ、アイコン）は`src/assets`に配置：** ビルド時に確実に含まれ、型安全性も確保される
2. **コンテンツ画像は外部ストレージを使用：** ビルド時間に影響せず、動的に管理できる
3. **`public`ディレクトリは注意が必要：** Firebase App Hostingでは問題が発生する可能性がある

最も確実な解決策は、`src/assets`ディレクトリに画像を配置して`import`する方法です。これにより、デプロイ環境の影響を受けずに確実に画像を配信できます。

## 参考リンク

- [概要と画像配信の仕組み](./next-image-404.md)
- [404エラーの原因と診断方法](./next-image-diagnosis.md)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Static File Serving](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Firebase App Hosting Documentation](https://firebase.google.com/docs/app-hosting)
- [Next.js の独自機能と便利ツール](../nextjs/nextjs-features.md)

