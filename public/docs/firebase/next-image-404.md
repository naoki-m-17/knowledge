# Firebase App Hosting: Next.js Image コンポーネント 404エラー完全解説

## 概要

Firebase App HostingでNext.jsプロジェクトをホスティングする際、`next/image`（Imageコンポーネント）を使用して`public`ディレクトリ内の画像を表示しようとすると、404エラーが発生することがあります。この問題は、Next.jsの画像配信の仕組みとFirebase App Hostingのデプロイフローの特性が複合的に影響することで発生します。

本記事では、この問題の根本原因を**ビルド・ホスティング・ロールアウトの各フェーズ**に分けて詳細に解説し、実践的な解決策を提示します。

## 問題の症状

以下のような状況で404エラーが発生します：

```tsx
// ❌ これが404エラーになる
import Image from 'next/image';

export default function Header() {
  return (
    <Image
      src="/logo.png"  // public/logo.png を参照
      alt="Logo"
      width={100}
      height={40}
    />
  );
}
```

**エラーの特徴：**
- ローカル開発環境（`npm run dev`）では正常に表示される
- Firebase App Hostingにデプロイすると404エラーになる
- ブラウザの開発者ツールで `/_next/image?url=%2Flogo.png&w=...` のようなURLが404を返す
- または、直接 `https://your-domain.com/logo.png` にアクセスしても404になる

## Next.jsの画像配信の仕組み

### `public`ディレクトリ vs `src/assets`ディレクトリ

Next.jsでは、画像の配置場所と読み込み方法によって、画像の処理方法が大きく異なります。

| 特徴 | `public`（パス指定） | `src/assets`（import指定） |
| --- | --- | --- |
| **読み込み方** | `src="/logo.png"` (文字列) | `import logo from "@/assets/logo.png"` |
| **ビルド時処理** | そのままコピーされる | Webpack/Turbopackが処理 |
| **型安全性** | なし（パス間違いに気づかない） | **あり**（ファイルがないとコンパイルエラー） |
| **キャッシュ** | ブラウザ/CDN依存 | ハッシュ値が付与され、強力にキャッシュされる |
| **最適化タイミング** | **実行時（オンデマンド）** | **ビルド時（事前）** |
| **推奨用途** | `favicon`や数が多い動的な画像 | **ロゴ、アイコン、UIで使う固定画像** |

### 画像最適化の仕組み

#### `public`ディレクトリの場合（パス指定）

```tsx
<Image src="/logo.png" alt="Logo" width={100} height={40} />
```

**処理フロー：**
1. ビルド時：`public/logo.png`がそのまま出力ディレクトリにコピーされる
2. 実行時：ブラウザが `/_next/image?url=%2Flogo.png&w=100&q=75` にリクエスト
3. Next.jsのImage Optimizerが**実行時に**画像を読み込んで最適化処理を実行
4. 最適化された画像をキャッシュして返す

**特徴：**
- 画像最適化は**実行時（オンデマンド）**に行われる
- Image Optimizerサーバーが動作している必要がある
- 初回アクセス時に最適化処理が発生するため、若干の遅延が発生する可能性がある

#### `src/assets`ディレクトリの場合（import指定）

```tsx
import logo from '@/assets/logo.png';
<Image src={logo} alt="Logo" />
```

**処理フロー：**
1. ビルド時：Webpack/Turbopackが画像を解析し、サイズ情報を取得
2. ビルド時：画像にハッシュ値を付与（例：`logo.a1b2c3d4.png`）
3. ビルド時：必要に応じて最適化処理を実行
4. 実行時：最適化済みの画像が既に存在するため、即座に配信可能

**特徴：**
- 画像最適化は**ビルド時（事前）**に行われる
- Image Optimizerサーバーが動作していなくても配信可能
- ビルド時に画像サイズが確定するため、レイアウトシフト（CLS）を防ぎやすい

詳細については、[Next.js の独自機能と便利ツール](../nextjs/nextjs-features.md#image-コンポーネント)も参照してください。

## 関連記事

この問題を解決するために、以下の記事を参照してください：

- **[404エラーの原因と診断方法](./next-image-diagnosis.md)** - ビルド・ホスティング・ロールアウトの各フェーズでの問題と、原因を特定する方法を詳しく解説
- **[解決策と実装パターン](./next-image-fix.md)** - 実践的な解決策と、推奨される実装パターン、トラブルシューティング

## まとめ

Firebase App HostingでNext.jsのImageコンポーネントが404エラーになる原因は、主に以下の3つのフェーズで発生します：

1. **ビルドフェーズ：** `public`ディレクトリがビルド成果物に含まれていない
2. **ホスティングフェーズ：** Image Optimizerサーバーの権限不足や静的ファイルの振り分け失敗
3. **ロールアウトフェーズ：** CDNキャッシュやデプロイ設定の不整合

**最も確実な解決策は、`src/assets`ディレクトリに画像を配置して`import`する方法です。** これにより、ビルド時に画像がバンドルに含まれ、デプロイ環境の影響を受けずに確実に配信されます。

ロゴやアイコンなどのUIパーツは`src/assets`に配置し、コンテンツ画像は外部ストレージを使用するという使い分けが推奨されます。

## 参考リンク

- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Static File Serving](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Firebase App Hosting Documentation](https://firebase.google.com/docs/app-hosting)
- [Next.js の独自機能と便利ツール](../nextjs/nextjs-features.md)
- [Firebase App Hosting: Secret Manager 権限付与マニュアル](./secret-manager-setup.md)
