# Node.js環境構築

このドキュメントでは、**fnm** と **Corepack** を用いた Node.js と pnpm のセットアップについて説明します。

## .zshrc による自動化（Homebrew セットアップで既に導入済み）

[Homebrewとシェル環境のセットアップ](./homebrew-shell-setup.md) の `.zshrc` には `_fnm_auto_setup` 関数が定義されています。これにより、プロジェクトディレクトリ（`.node-version` または `.nvmrc` があるフォルダ）に `cd` するだけで、以下が**すべて自動**で行われます。

| 処理 | 自動化の内容 |
|------|---------------|
| **Node のインストール** | 指定バージョンが未インストールなら `fnm install` を自動実行 |
| **Node の切り替え** | `fnm use` でプロジェクト指定のバージョンに自動切り替え |
| **pnpm の有効化** | pnpm が未設定なら `corepack enable pnpm` を自動実行 |
| **パスの確立** | fnm が Node の実行パスを設定し、Corepack が pnpm をパスにリンク |

そのため、プロジェクトで作業する場合は **`cd` するだけで Node と pnpm が使える状態**になります。手動で `fnm install` や `corepack enable pnpm` を打つ必要はありません。

## 経緯（Volta ではなく fnm を選択）

本来、Node.jsのバージョン管理には **Volta** も有力な選択肢です。しかし、**pnpm** をパッケージマネージャとして主に使用する場合、Voltaがpnpmのバージョンも同時に管理しようとし、挙動が干渉するケースがあります。そのため、**干渉を避けるために Volta ではなく fnm を採用**しています。fnm は Node.js のバージョン切り替えのみを担当し、pnpm は Node.js に同梱される Corepack で有効化する構成にすることで、役割が分離されクリーンに動作します。

## Node.js の導入

fnm は [Homebrewとシェル環境のセットアップ](./homebrew-shell-setup.md) で既にインストール済みです。プロジェクト内では上記の通り自動で処理されます。

### fnm の Node 格納先を明示する（一般的なエンジニア向け）

`export FNM_DIR="$HOME/.local/share/fnm"` のように明示的に設定すれば、**OS を問わず同じ場所**に Node.js をインストールさせることができます。

**補足（macOS での「未設定時」の挙動）**: 最新の fnm は macOS においてもデフォルトで `~/.local/share/fnm` を使うようになっています。以前は `~/Library/Application Support/fnm` をデフォルトとする動きもありましたが、CLI ツールの標準化が進み、現在は Mac でも Linux と同じ `~/.local/share/fnm` を優先する実装になっています。それでも明示的な設定を推奨する理由は以下です。

- **クロスプラットフォームの一貫性**: 設定ファイル（`.zshrc` や `.bashrc`）を GitHub 等で共有（Dotfiles）している場合、どの PC でも同じ構造を保てるため、管理が非常に楽になります。
- **XDG への統一**: 本来 Linux の規格である `~/.local/share` に macOS 側を寄せることで、モダンなエンジニアリング環境のデファクトスタンダードに準拠できます。
- **pnpm との並列配置**: fnm と pnpm を `~/.local/share` 配下に揃えることで、「開発ツール共有データ特区」としてホームディレクトリをスッキリ保てます。

`.zshrc` の fnm 初期化より前に以下を設定しています（homebrew-shell-setup のサンプルに含まれています）。

```bash
export FNM_DIR="$HOME/.local/share/fnm"
```

**実行タイミング**: `fnm install` やプロジェクトでの Node 自動インストールが**一度も発生する前**に `.zshrc` に記載しておく必要があります。一度でも fnm が別の場所に Node を入れてしまうと、後から変更しても既存の Node が残ったままになります。

**コマンドの構造**:
- `export <変数名>=<値>`: 現在のシェルと子プロセスに環境変数を渡します。
- `FNM_DIR`: fnm が Node のバイナリを格納するルートディレクトリを指定する環境変数です。
- `$HOME/.local/share/fnm`: XDG 準拠のパス。pnpm の `~/.local/share/pnpm/store` と同様に、ツールの配置を一貫して管理できます。

**プロジェクト外**（どのプロジェクトでもないディレクトリ）で Node を使う場合のみ、デフォルトバージョンを手動で設定します。

```bash
fnm install --lts    # 最新のLTS版をインストール
fnm default 22       # デフォルトを Node 22 に設定（任意）
```

**確認方法**: 以下のコマンドでNode.jsとnpmのバージョンが表示されれば成功です。

```bash
node --version
npm --version
```

## pnpm の導入

pnpm は **Corepack**（Node.js 同梱）で有効化します。グローバルインストールは不要です。プロジェクトに `cd` したときに pnpm が未設定なら、`_fnm_auto_setup` が自動で `corepack enable pnpm` を実行します。

プロジェクト外で最初に pnpm を使う前など、手動で有効化したい場合は以下を実行します。

```bash
corepack enable pnpm
```

**意味**: Corepack が pnpm の実行ファイルを管理し、プロジェクトや Node バージョンに応じた適切な pnpm を自動で解決します。

### pnpm ストアの保存場所を事前に指定する（必須タイミング）

**結論**: 伝統的には `~/.pnpm-store` ですが、現代の洗練されたエンジニアリング環境では **`~/.local/share/pnpm/store` がより一般的（推奨）** です。以下、その背景を整理します。

#### なぜ二通りの場所があるのか？

**A. `~/.pnpm-store`（旧・シンプル派）**
- **背景**: ツールが「とりあえずユーザーの目につく場所に設定を置く」という初期の UNIX 文化の名残です。
- **メリット**: `ls -a ~` を叩けばすぐに見つかります。
- **デメリット**: ホームディレクトリ（`~/`）がドットファイルだらけになり、整理がつかなくなります。

**B. `~/.local/share/pnpm/store`（新・整理派）**
- **背景**: **XDG Base Directory Specification** という標準規格に基づいた配置です。
- **メリット**: 「ユーザーが作成したデータ」と「ツールが自動生成したデータ（キャッシュやストア）」を明確に分離できます。
- **デメリット**: 階層が深く、手動でたどるのが少し面倒です。

#### なぜ `.local/share` が「一般的」と言えるのか？

エンジニアが新しい環境（特に Apple Silicon Mac など）を構築する際、多くの場合「ホームディレクトリを汚したくない」と考えます。最近の主要なツールは、この規格に従ってデフォルトの保存先を決めています：

| ツール | 配置 |
|--------|------|
| fnm | `~/.local/share/fnm` |
| pnpm | `~/.local/share/pnpm/store`（本設定で指定） |
| uv (Python) | `~/.local/share/uv` |

fnm がすでに `.local/share` を使っているため、pnpm も並べて配置することで、Mac の中身が**「開発ツール共有データ特区」**としてスッキリ整理されます。

---

**実行タイミング**: `pnpm install` や `pnpm add` を**一度も実行していない段階**で、先に以下を実行してください。一度でもパッケージをインストールすると pnpm がデフォルトのストアを作成してしまい、後から変更しても既存のキャッシュが別場所に残ったままになります。

```bash
pnpm config set store-dir ~/.local/share/pnpm/store --global
```

**コマンドの構造**:
- `pnpm config set <キー> <値> [--global]`: pnpm の設定を書き換えます。
- `store-dir`: パッケージのグローバルキャッシュ（ストア）を置くディレクトリを指定する設定キーです。
- `~/.local/share/pnpm/store`: 上記の通り、XDG 準拠の整理派の配置です。
- `--global`（または `-g`）: ユーザー全体に適用するグローバル設定として保存します。プロジェクトごとの `.npmrc` ではなく、`~/.config/pnpm/` などのユーザー設定として記録されます。

**確認方法**: 以下のコマンドでpnpmのバージョンが表示されれば成功です。

```bash
pnpm --version
```

## プロジェクトでの使用

プロジェクトで使用する Node.js のバージョンを固定するには、プロジェクトのルートディレクトリに `.node-version` または `.nvmrc` を配置します。

```bash
# プロジェクトディレクトリで実行
echo "22" > .node-version
```

**例（.node-version）**:
```
22
```

**例（.nvmrc、nvm互換）**:
```
22
```

プロジェクトディレクトリに `cd` すると、`_fnm_auto_setup` が冒頭の表の通り、切り替え・インストール・pnpm有効化・パス確立を自動で行います。**「.node-version を作り忘れる」「切り替え忘れる」という事故を防ぐ**ため、ディレクトリ移動のたびに自動で切り替わります。

## ツールの管理方針

CLI ツール（Firebase CLI、ESLint、Prettier など）は **brew や fnm 配下のグローバルにはインストールしない**ことを推奨します。代わりに以下を使います。

- **プロジェクト依存**: `pnpm add -D firebase-tools` などで devDependencies に追加し、`pnpm exec firebase` や `pnpm firebase` で実行
- **都度実行**: `pnpm dlx firebase-tools` や `npx firebase-tools` で一時実行

これにより、Node.js 由来のツールが brew に混ざって node を自動インストールする事態を避け、環境をクリーンに保てます。

## 次のステップ

Node.js環境の構築が完了したら、必要に応じて[Firebase設定](./firebase-setup.md)に進んでください。
