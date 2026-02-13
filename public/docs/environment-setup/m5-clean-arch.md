# M5 Mac Clean Architecture: 開発基盤の設計と構築

このドキュメントは、M5 MacBook Proの性能を最大限に引き出し、OS、ツール、プロジェクトが互いに干渉しない「クリーンな開発基盤」を構築するための設計図です。各セクションは独立したドキュメントとして分割されているため、必要に応じて参照してください。

## 完成後のディレクトリ・ツリー構造

構築完了後、Mac内部は以下の論理構造になります。

```
/ (Root)
├── opt/
│   └── homebrew/                # 【汎用ツール特区】Homebrew管理（node由来ツールは入れない）
│       ├── bin/                 # git, tree, fnm 等の共通ツール
│       │   ├── brew
│       │   ├── git
│       │   ├── fnm              # Node.js バージョン管理 (brew install fnm で導入)
│       │   └── tree             # ディレクトリ構造可視化 (brew install tree で導入)
│       └── Cellar/              # 各ツールの本体がバージョン別に格納される場所
│
└── Users/
    └── matsunaganaoki/          # 【ユーザー領域】 ~/
        ├── .zshrc               # fnm・Corepack・シェル設定の心臓部
        ├── .local/
        │   └── share/
        │       ├── fnm/            # 【JS開発特区】fnm が Node を管理（FNM_DIR で指定した場合）
        │       │   └── node-versions/  # Node v20, v22 等の実体
        │       └── pnpm/
        │           └── store/      # pnpmのキャッシュ倉庫（store-dirで指定した場合）
        ├── .config/
        │   └── configstore/     # Firebase CLI の認証情報。pnpm exec 等でプロジェクト内から実行しても、
        │                       # firebase login 時にユーザーのホームに自動作成。1回のログインで全プロジェクト共通
        └── src/                 # 開発プロジェクト（ホームディレクトリ直下に配置）
            └── my-next-app/
                ├── .node-version # fnm が読み取り、自動で Node を切り替え
                ├── package.json
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

fnm を採用することで、**「どのプロジェクトで、どのNodeを使っているか」を一切意識する必要がなくなります。**

1. プロジェクトに入る
2. fnm が `.node-version` を見て、裏側で勝手に Node を切り替える（pnpm は Corepack で有効化）
3. `pnpm install` や `npm run dev` を打つだけ

この「何も考えなくていい状態」こそが、初心者からプロまでが求める理想の開発環境です。`.node-version` をプロジェクトに置いておけば、`cd` のたびに自動で切り替わるため、「.node-version を作り忘れる」「切り替え忘れる」という事故が物理的に発生しなくなります。また、brew には Node 由来のツールを入れず、CLI は pnpm や npx で管理することで、パス競合を避けたクリーンな構成を維持します。

あとは、現在利用中の筐体のターミナルで `cat ~/.zshrc` と打ってみて、ご自身で追加した「alias（エイリアス）」や「環境変数」がないかだけ確認してみてください。もしあれば、それを各セクションのドキュメントに追加すると、使い慣れた操作感も新マシンに移植できます。

