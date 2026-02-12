# M5 Mac Clean Architecture: 開発基盤の設計と構築

このドキュメントは、M5 MacBook Proの性能を最大限に引き出し、OS、ツール、プロジェクトが互いに干渉しない「クリーンな開発基盤」を構築するための設計図です。各セクションは独立したドキュメントとして分割されているため、必要に応じて参照してください。

## 完成後のディレクトリ・ツリー構造

構築完了後、Mac内部は以下の論理構造になります。

```
/ (Root)
├── opt/
│   └── homebrew/                # 【汎用ツール特区】Homebrew管理
│       ├── bin/                 # コマンドのリンク（git, firebase等）が集まる場所
│       │   ├── brew
│       │   ├── git
│       │   ├── firebase         # Firebase CLI (brew install firebase-cli で導入)
│       │   └── tree             # ディレクトリ構造可視化 (brew install tree で導入)
│       └── Cellar/              # 各ツールの本体がバージョン別に格納される場所
│
└── Users/
    └── matsunaganaoki/          # 【ユーザー領域】 ~/
        ├── .zshrc               # Voltaのパス設定等、全ての環境設定が記された心臓部
        ├── .volta/              # 【JS開発特区】VoltaがNode/npm/pnpmを全管理
        │   ├── bin/             # node, npm, pnpm への入り口（Shim）
        │   └── tools/           # Node v20, v22 等の実体（全てここに完結）
        ├── .pnpm-store/         # pnpmのキャッシュ倉庫（Volta管理のpnpmがここを使用）
        ├── .config/
        │   └── configstore/     # firebase-cliの認証情報（firebase login で自動作成）
        └── src/                 # 開発プロジェクト（ホームディレクトリ直下に配置）
            └── my-next-app/
                ├── package.json # Voltaのバージョン情報がvoltaフィールドで自動追記
                └── node_modules # storeへの「リンク」のみ。実体は置かない
```

**重要**: `~/src`はホームディレクトリ直下（`~/Desktop`や`~/Documents`の外）に配置してください。iCloud Driveで「デスクトップ」や「書類」フォルダを同期設定にしている場合、`node_modules`を含むプロジェクトフォルダがiCloudの同期対象になると、大量のファイルスキャンでCPUとネットワークを無駄に消費してしまいます。

## 構築手順

以下の順序で環境構築を進めてください。

1. [Homebrewとシェル環境のセットアップ](./homebrew-shell-setup.md) - システム基盤、パッケージマネージャー、シェル環境設定
2. [Node.js環境構築](./nodejs-setup.md) - Node.jsとpnpmのセットアップ
3. [Firebase設定](./firebase-setup.md) - Firebase CLIの認証設定（Firebase App Hostingを使用する場合）
4. [メンテナンス](./maintenance.md) - 日常的なメンテナンスの習慣

## 総括

これで、**「どこに何が入っているか、なぜそれが必要か」**が全て可視化されました。

Voltaを採用することで、**「どのプロジェクトで、どのNodeを使っているか」を一切意識する必要がなくなります。**

1. プロジェクトに入る
2. Voltaが `package.json` を見て、裏側で勝手にNodeとpnpmを切り替える
3. `pnpm install` や `npm run dev` を打つだけ

この「何も考えなくていい状態」こそが、初心者からプロまでが求める理想の開発環境です。`volta pin` コマンドを一度打てば、プロジェクトの定義ファイル自体にバージョンが刻まれるため、「.node-version を作り忘れる」「切り替え忘れる」という事故が物理的に発生しなくなります。

あとは、現在利用中の筐体のターミナルで `cat ~/.zshrc` と打ってみて、ご自身で追加した「alias（エイリアス）」や「環境変数」がないかだけ確認してみてください。もしあれば、それを各セクションのドキュメントに追加すると、使い慣れた操作感も新マシンに移植できます。

