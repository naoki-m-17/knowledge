# Homebrewとシェル環境のセットアップ

このドキュメントでは、M5 MacBook Proでの開発環境の基盤となる部分を構築します。

## 1. システム基盤の準備

新しいMacが届いたら、最初にターミナル（Terminal.app）を開き、以下の「土台」をインストールします。

### Rosetta 2 のインストール

```bash
softwareupdate --install-rosetta --agree-to-license
```

**意味**: Intelチップ向けに書かれた古い命令をM5チップで解釈するためのエミュレーターです。

**理由**: 多くの開発ツールはすでにM5ネイティブ（arm64）ですが、稀にnpmパッケージの依存ライブラリにIntel専用バイナリが含まれる場合があり、これがないとエラーで止まるのを防ぎます。

### Xcode Command Line Tools のインストール

```bash
xcode-select --install
```

**意味**: Appleが提供する最小限のコンパイルツールセット（git, clang, make等）です。

**理由**: Homebrew自体のインストールや、ソースコードからバイナリをビルドするために必須の基盤です。

## 2. パッケージマネージャーの導入

### Homebrew のインストール

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**意味**: macOS用パッケージマネージャー。システム（/opt/homebrew）に共通ツールを追加します。

**理由**: Apple標準では提供されない最新のGitや管理ツールを一括管理するためです。

### 必須ツールの導入

```bash
brew install git firebase-cli tree
```

- **git**: macOS標準よりも新しい、Homebrew版の最新Gitを使用します。
- **firebase-cli**: Firebase App HostingやSecret Managerの操作に必要なCLIツールです。
- **tree**: ディレクトリ構造をツリー形式で可視化するコマンドです。

**注意**: Node.jsのバージョン管理には **Volta** を使用します。Voltaはユーザー領域（`~/.volta/`）に独立してインストールするため、Homebrewでは導入しません。これにより、Homebrewのパス競合を避け、開発ツール専用の「優先レーン」を確保できます。

### Volta のインストール（ユーザー領域）

VoltaはNode.js、npm、pnpmを一元管理するRust製の高速ツールです。`~/.volta/` にインストールすることで、権限トラブルを回避し、開発環境を独立させます。

```bash
curl https://get.volta.sh | bash
```

**意味**: Voltaの公式インストーラーを実行し、`~/.volta/` にバイナリを配置します。インストーラーは自動的に `.zshrc` に `VOLTA_HOME` と `PATH` の設定を追記します。

**確認方法**: 新しいターミナルを開き、以下のコマンドでバージョンが表示されれば成功です。

```bash
volta --version
```

## 3. シェル環境設定 (.zshrc) の構築

`.zshrc`（Z-Shell Run Control）は、ターミナルが起動するたびに読み込まれる設定ファイルです。

```bash
# 設定ファイルを開く
nano ~/.zshrc
```

以下の内容を追記・保存してください（Ctrl+O で保存、Ctrl+X で閉じる）。

**重要**: 設定の順序は重要です。Homebrewの初期化を最上部に配置することで、brewでインストールしたツールが他のツールの挙動に干渉することを防ぎます。Voltaの設定はインストーラーが自動的に `.zshrc` に追記するため、手動で追加する必要はありません。既存の `.zshrc` がある場合は、以下の内容を参考に不足分のみ追記してください。

```bash
### 1. Homebrewの有効化（最上部に配置）
# Homebrewがインストールしたバイナリ(/opt/homebrew/bin)に優先的にパスを通します
# 注意: この設定は必ず .zshrc の最上部に配置してください
eval "$(/opt/homebrew/bin/brew shellenv)"

### 2. Volta（Node.js・pnpm管理人）の初期化
# Voltaインストーラーが自動追記します。手動で追加する場合は以下を記述：
# export VOLTA_HOME="$HOME/.volta"
# export PATH="$VOLTA_HOME/bin:$PATH"
# プロジェクトのpackage.jsonにVoltaのバージョン指定があれば、自動的に切り替わります

### 3. ターミナル表示（Gitブランチ表示など）
# Gitの状況をプロンプトに表示する設定
if [[ -r /Library/Developer/CommandLineTools/usr/share/git-core/git-prompt.sh ]]; then
  source /Library/Developer/CommandLineTools/usr/share/git-core/git-prompt.sh
fi

# プロンプトのオプション表示設定
GIT_PS1_SHOWDIRTYSTATE=true      # 変更ファイルがある場合に*を表示
GIT_PS1_SHOWUNTRACKEDFILES=true  # 未追跡ファイルがある場合に%を表示
GIT_PS1_SHOWSTASHSTATE=true      # stashがある場合に$を表示
GIT_PS1_SHOWUPSTREAM=auto        # 上流ブランチとの差分を表示

# プロンプトの色とレイアウトを定義
setopt PROMPT_SUBST
PS1='%F{green}%n@%m%f:%F{cyan}%1~%f%F{red}$(__git_ps1 "(%s)")%f\$ '

### 4. 便利なエイリアス
alias p='pnpm'
```

設定を反映するには、新しいターミナルを開くか、以下のコマンドを実行してください。

```bash
source ~/.zshrc
```

## 次のステップ

Homebrewとシェル環境のセットアップが完了したら、[Node.js環境構築](./nodejs-setup.md)に進んでください。