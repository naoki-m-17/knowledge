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
brew install git tree fnm
```

- **git**: macOS標準よりも新しい、Homebrew版の最新Gitを使用します。
- **tree**: ディレクトリ構造をツリー形式で可視化するコマンドです。
- **fnm**: Node.jsのバージョン管理ツールです。

**重要（brew方針）**: Node.js由来のツール（firebase-cli など）をbrewでインストールすると、brewが依存関係としてNode.jsを自動インストールし、fnmで管理しているNode.jsとパスが競合して不具合の原因になります。**CLIツールは pnpm や npx で管理し、brewやfnm配下のグローバルには入れない**ようにしてください。brewには、git・tree・fnmのように Node.js に依存しない共通ツールのみを入れ、クリーンな環境を維持します。

## 3. シェル環境設定 (.zshrc) の構築

`.zshrc`（Z-Shell Run Control）は、ターミナルが起動するたびに読み込まれる設定ファイルです。先頭の `.` により隠しファイルとなっているため、Finder やテキストエディタで `~/` を開いても通常は表示されません。表示方法は以下のいずれかです。

- **キーボード**: Finder で **Command + Shift + .** を押すと切り替わります（再度押すと非表示に戻ります）
- **コマンドで常時表示**:
  ```bash
  defaults write com.apple.finder AppleShowAllFiles -bool true
  killall Finder
  ```
  非表示に戻す場合は `true` を `false` に変えて再実行してください。

  **コマンドの構造**:
  - `defaults write <ドメイン> <キー> -<型> <値>`: macOS のアプリケーション設定（plist）をコマンドラインから書き換えます。`com.apple.finder` は Finder の設定領域、`AppleShowAllFiles` は隠しファイル表示の有効/無効を制御するキー、`-bool true` で「有効」を指定します。
  - `killall Finder`: 実行中の Finder プロセスを終了させます。Finder は自動で再起動し、その際に上記で変更した設定が読み込まれ、隠しファイルが表示されるようになります。

```bash
# 設定ファイルを開く
nano ~/.zshrc
```

以下の内容を追記・保存してください（Ctrl+O で保存、Ctrl+X で閉じる）。

**重要**: 設定の順序は重要です。Homebrewの初期化を最上部に配置することで、brewでインストールしたツールが他のツールの挙動に干渉することを防ぎます。`FNM_DIR` は **fnm を初めて使う前**（`fnm install` やプロジェクトでの Node 自動インストールが発生する前）に設定しておくことで、Dotfiles 共有やクロスプラットフォームの一貫性を保てます。既存の `.zshrc` がある場合は、以下の内容を参考に不足分のみ追記してください。

```bash
# ==========================================
# Homebrew（必ず.zshrc の最上部に配置）
# ==========================================

eval "$(/opt/homebrew/bin/brew shellenv)"


# ==========================================
# Node.js & Package Manager (fnm + Corepack)
# ==========================================

# Corepackの自動ダウンロードを許可 (fnm初期化より前)
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# fnm の Node 格納先（fnm初期化より前）
export FNM_DIR="$HOME/.local/share/fnm"

# fnmの初期化
eval "$(fnm env)"

# 自動インストール & 切り替え & Corepack有効化の関数
_fnm_auto_setup() {
  local version_file
  if [[ -f .node-version ]]; then
    version_file=".node-version"
  elif [[ -f .nvmrc ]]; then
    version_file=".nvmrc"
  fi

  if [[ -n "$version_file" ]]; then
    local version=$(cat "$version_file" | tr -d '[:space:]')
    
    # Node.js ランタイムの解決
    if ! fnm ls | grep -q "$version" 2>/dev/null; then
      echo "⚡️ Node $version not found. Starting auto-install..."
      fnm install "$version"
      echo "✅ Node $version setup completed."
    fi
    
    # 実行コンテキストの切り替え
    fnm use "$version" >/dev/null 2>&1
    echo "🚀 Switched runtime to Node $version."
    
    # パッケージマネージャの整合性確認
    if ! command -v pnpm > /dev/null 2>&1; then
      echo "💎 pnpm not found. Enabling via Corepack..."
      corepack enable pnpm >/dev/null 2>&1
      echo "✅ Linked pnpm to execution path via Corepack."
    else
      echo "🔗 Established pnpm resolution route via Corepack."
    fi
  else
    # プロジェクト外（グローバルコンテキスト）
    local current_version=$(node -v 2>/dev/null)
    echo "😐 Using fnm default (Node $current_version)."
  fi
}

# ディレクトリ移動フックに登録
autoload -U add-zsh-hook
add-zsh-hook chpwd _fnm_auto_setup
_fnm_auto_setup


# ==========================================
# Homebrew Node.js ガードレール
# ==========================================

brew() {
  # "install" コマンドかつ "--cask" が指定されていない場合のみチェックを実行
  if [[ "$1" == "install" ]] && [[ "$*" != *"--cask"* ]]; then
    local pkg="${@: -1}"
    
    echo "🔍 Scanning deep metadata and scripts for '$pkg'..."
    
    # 依存関係ツリー、パッケージ説明、JSONメタデータを取得して隠れた依存を調査
    local deps=$(command brew deps --include-build "$pkg" 2>/dev/null)
    local desc=$(command brew desc "$pkg" 2>/dev/null)
    local formula=$(command brew info --json=v2 "$pkg" 2>/dev/null)

    local all_info="${deps} ${desc} ${formula}"
    
    # node, npm, yarn, javascript のキーワードが含まれるか判定
    if echo "$all_info" | grep -Ei "node|npm|yarn|javascript" > /dev/null; then
      # Node.js 環境が検知された場合の警告
      echo -e "\033[1;33m⚠️  CRITICAL: Node.js/JS environment detected for '$pkg'.\033[0m"
      echo -e "This may conflict with your fnm environment by installing Homebrew-managed Node.js."
      echo -e "Recommendation: Use 'pnpm add -g' or 'brew install --cask' instead."
      echo -e "Do you want to proceed anyway? (y/N): \c"
    else
      # Node.js 依存が見つからなかった場合の成功メッセージ
      echo -e "\033[1;32m✅ Check complete. No hidden Node/JS found for '$pkg'.\033[0m"
      echo -e "Do you want to install it? (y/N): \c"
    fi

    # ユーザー入力を待機
    read -r answer
    if [[ "$answer" != [yY] ]]; then
      echo "Canceled."
      return 1
    fi
  fi

  # 実際の brew コマンドを実行
  command brew "$@"
}


# ==========================================
# ターミナル表示のカスタマイズ
# ==========================================

# Git補完とプロンプトスクリプトの読み込み
if [[ -r /Library/Developer/CommandLineTools/usr/share/git-core/git-prompt.sh ]]; then
  source /Library/Developer/CommandLineTools/usr/share/git-core/git-prompt.sh
fi
[[ -f ~/.zsh/git-prompt.sh ]] && source ~/.zsh/git-prompt.sh
fpath=(~/.zsh $fpath)
zstyle ':completion:*:*:git:*' script ~/.zsh/git-completion.bash
autoload -Uz compinit && compinit

# プロンプトのデザイン設定
setopt PROMPT_SUBST

precmd() {
  # 親ディレクトリの取得
  local parent=$(basename "$(dirname "$PWD")")
  if [[ "$PWD" == "$HOME" || "$parent" == "." || "$parent" == "/" ]]; then
    PARENT_DIR=""
  else
    PARENT_DIR="$parent/"
  fi

  # Git情報の取得とカスタマイズ
  local branch=$(git branch --show-current 2> /dev/null)
  if [[ -n "$branch" ]]; then
    local status_text="Synced"
    local s_color="121" # 同期済み
    
    local git_status=$(git status --branch --porcelain 2> /dev/null)
    
    # 状態の判定（優先順位順）
    if [[ "$git_status" =~ "behind" ]]; then
        status_text="Behind"
        s_color="203" # リモートに更新あり
    elif [[ "$git_status" =~ "ahead" ]]; then
        status_text="Ahead"
        s_color="117" # 未プッシュあり
    elif [[ -n $(git stash list 2> /dev/null) ]]; then
        status_text="Stashed"
        s_color="211" # スタッシュ
    elif [[ -n $(echo "$git_status" | grep '^??') ]]; then
        status_text="Untracked"
        s_color="211" # 未追跡
    elif [[ -n $(echo "$git_status" | grep '^.[MARC]') ]]; then
        status_text="Unstaged"
        s_color="215" # 変更あり
    elif [[ -n $(echo "$git_status" | grep '^[MARC]') ]]; then
        status_text="Staged"
        s_color="117" # ステージ済
    fi
    
    # 表示の組み立て
    GIT_INFO=" %F{215}${branch}%f%F{242}(%f%F{${s_color}}${status_text}%f%F{242})%f"
  else
    # Git管理外
    GIT_INFO=" %F{242}(Not Git)%f"
  fi
}

# 配色の定義：
PS1='%F{242}%n%f %F{181}${PARENT_DIR}%f%F{211}%1~%f${GIT_INFO}
%F{121}$%f '


# ==========================================
# エイリアス
# ==========================================

alias p='pnpm'
# プロジェクトにあればローカル、なければリモート取得で実行
alias firebase='npx firebase-tools'


# ==========================================
# 自動追加ゾーン
# ==========================================
```

設定を反映するには、新しいターミナルを開くか、以下のコマンドを実行してください。

```bash
source ~/.zshrc
```

## 次のステップ

Homebrewとシェル環境のセットアップが完了したら、[Node.js環境構築](./nodejs-setup.md)に進んでください。