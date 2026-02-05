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
brew install fnm git firebase-cli
brew install --cask google-cloud-sdk
```

- **fnm**: Fast Node Manager。Rust製で、Node.jsのバージョンを高速に切り替えます。
- **git**: macOS標準よりも新しい、Homebrew版の最新Gitを使用します。
- **firebase-cli**: Firebase App HostingやSecret Managerの操作に必要なCLIツールです。
- **google-cloud-sdk**: Google Cloudの操作に必要なCLIツール。Firebase CLIが内部的にGoogle Cloudの権限を利用する際に必要です。

## 3. シェル環境設定 (.zshrc) の構築

`.zshrc`（Z-Shell Run Control）は、ターミナルが起動するたびに読み込まれる設定ファイルです。

```bash
# 設定ファイルを開く
nano ~/.zshrc
```

以下の内容を追記・保存してください（Ctrl+O で保存、Ctrl+X で閉じる）。

**重要**: 設定の順序は重要です。Homebrewの初期化を最上部に配置することで、brewでインストールしたツールが他のツール（fnm等）の挙動に干渉することを防ぎます。

```bash
### 1. Homebrewの有効化（最上部に配置）
# Homebrewがインストールしたバイナリ(/opt/homebrew/bin)に優先的にパスを通します
# 注意: この設定は必ず .zshrc の最上部に配置してください
#       将来的にbrewで入れた他のツールがfnmの挙動に干渉する場合に備えます
eval "$(/opt/homebrew/bin/brew shellenv)"

### 2. fnm (Node.js管理人) の初期化
# --use-on-cd: プロジェクト移動時に .node-version ファイルを自動検知して
#              そのディレクトリ専用のNodeバージョンに即座に切り替えます
eval "$(fnm env --use-on-cd)"

### 3. pnpm の環境変数定義
# PNPM_HOME: pnpmの実行ファイルを置く場所を指定
export PNPM_HOME="$HOME/.local/share/pnpm"
# PATHへの追加: pnpmコマンドをどこからでも叩けるようにします
export PATH="$PNPM_HOME:$PATH"

### 4. Google Cloud SDK の有効化
# Google Cloud SDKのパスと補完機能を有効化します
if [ -f '/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc' ]; then 
  . '/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc'
fi
if [ -f '/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.zsh.inc' ]; then 
  . '/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.zsh.inc'
fi

### 5. ターミナル表示（Gitブランチ表示など）
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

### 6. 便利なエイリアス（任意）
alias gs='git status'
alias p='pnpm'
```

設定を反映するには、新しいターミナルを開くか、以下のコマンドを実行してください。

```bash
source ~/.zshrc
```

## 次のステップ

Homebrewとシェル環境のセットアップが完了したら、[Node.js環境構築](./nodejs-setup.md)に進んでください。