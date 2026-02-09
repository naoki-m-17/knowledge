# M5 Mac Clean Architecture: 開発基盤の設計と構築

このドキュメントは、M5 MacBook Proの性能を最大限に引き出し、OS、ツール、プロジェクトが互いに干渉しない「クリーンな開発基盤」を構築するための設計図です。各セクションは独立したドキュメントとして分割されているため、必要に応じて参照してください。

## 完成後のディレクトリ・ツリー構造

構築完了後、Mac内部は以下の論理構造になります。

```
/ (Root)
├── opt/
│   └── homebrew/                # 【PC共通】Homebrew管理特区
│       ├── bin/                 # コマンドのリンク（git, fnm等）が集まる場所
│       │   ├── brew
│       │   ├── git
│       │   ├── fnm
│       │   ├── firebase         # Firebase CLI (brew install firebase-cli で導入)
│       │   └── tree             # ディレクトリ構造可視化 (brew install tree で導入)
│       └── Cellar/              # 各ツールの本体がバージョン別に格納される場所
│
└── Users/
    └── matsunaganaoki/          # 【ユーザー領域】 ~/
        ├── .zshrc               # 全ての環境設定が記された心臓部
        ├── .fnm/                # fnmが管理するNode.jsの各実体
        │   └── node-versions/
        │       └── v22.x.x/
        │           └── bin/
        │               ├── node
        │               └── corepack (Node内蔵の門番)
        ├── .local/share/pnpm/   # Corepackが呼び出したpnpm本体 (PNPM_HOME)
        ├── .pnpm-store/         # パッケージの「実体」が保存される巨大な倉庫
        ├── .config/
        │   └── configstore/    # firebase-cliの認証情報（firebase login で自動作成）
        └── src/                 # 開発プロジェクト（ホームディレクトリ直下に配置）
            └── my-next-app/
                ├── .node-version # プロジェクトが要求するNodeバージョンを記載
                └── node_modules  # storeへの「リンク」のみ。実体は置かない
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

特に `.zshrc` に書き込んだ `eval "$(fnm env --use-on-cd)"` は、複数のNext.jsプロジェクトを抱えた際、「Nodeのバージョン違いでビルドエラーが起きる」という無駄なトラブルを100%防いでくれる、実務上の「防波堤」になります。

あとは、現在利用中の筐体のターミナルで `cat ~/.zshrc` と打ってみて、ご自身で追加した「alias（エイリアス）」や「環境変数」がないかだけ確認してみてください。もしあれば、それを各セクションのドキュメントに追加すると、使い慣れた操作感も新マシンに移植できます。

