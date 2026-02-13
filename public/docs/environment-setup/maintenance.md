# メンテナンスの習慣

開発環境を健全に保つための、日常的なメンテナンスの習慣をまとめます。

## 定期的な更新

### Homebrew更新

週に一度、Homebrewとインストール済みのパッケージを更新します。

```bash
brew update && brew upgrade
```

**意味**: 
- `brew update`: Homebrew自体を最新版に更新します。
- `brew upgrade`: インストール済みのパッケージを最新版に更新します。

### Firebase CLI更新

Firebase CLI はプロジェクトの devDependencies または `pnpm dlx` で使用しているため、プロジェクト内で `pnpm update firebase-tools` を実行するか、`pnpm dlx firebase-tools` 利用時は毎回最新版が取得されます。グローバルインストールはしていないため、brew での更新は不要です。

### fnm更新

fnm は Homebrew でインストールしているため、Homebrew の更新と同時に更新されます。数ヶ月に一度、`brew upgrade` で fnm も含めて更新されます。

```bash
fnm --version  # 現在のバージョンを確認
brew upgrade fnm  # 必要に応じて単体で更新
```

**意味**: fnm 本体を更新しても、Node.js のバージョンは各プロジェクトの `.node-version` で固定されているため、プロジェクトの動作には影響しません。

## ストレージのクリーンアップ

### pnpm倉庫の掃除

数ヶ月に一度、不要なパッケージキャッシュを削除します。

```bash
pnpm store prune
```

**意味**: 使用されていないパッケージのキャッシュを削除し、ディスク容量を節約します。

**注意**: このコマンドを実行すると、現在どのプロジェクトでも使用されていないパッケージが削除されます。次回そのパッケージが必要になった際は、再度ダウンロードされます。

## 環境の確認

定期的に、インストール済みのツールのバージョンを確認しておくと、問題の早期発見に役立ちます。

```bash
# fnmのバージョン確認
fnm --version

# Node.jsのバージョン確認
node --version

# pnpmのバージョン確認
pnpm --version

# Firebase CLI（プロジェクト内 or pnpm dlx）のバージョン確認
pnpm exec firebase --version
# または pnpm dlx firebase-tools --version

# Homebrewでインストール済みのパッケージ一覧
brew list
```

## トラブルシューティング

### コマンドが見つからない場合

新しいターミナルを開くか、`.zshrc`の設定を再読み込みしてください。

```bash
source ~/.zshrc
```

### パスの問題が発生した場合

Homebrewの初期化が`.zshrc`の最上部に配置されているか確認してください。

```bash
cat ~/.zshrc | head -5
```

最初の数行に `eval "$(/opt/homebrew/bin/brew shellenv)"` が含まれている必要があります。fnm を使用している場合は、`eval "$(fnm env)"` が設定されていることも確認してください。

### Node.js環境の完全リセットが必要な場合

fnm は環境変数 `FNM_DIR` で指定したディレクトリ（未指定時は最新版では `~/.local/share/fnm` がデフォルト）に Node を格納しています。万が一開発環境が壊れた際は、このフォルダを削除するだけで Node 環境だけを完全に初期化できます。OSやHomebrewには影響しません。

```bash
# 本ドキュメントの推奨設定、または最新 fnm のデフォルト
rm -rf ~/.local/share/fnm
```

その後、`.zshrc` の fnm 初期化設定はそのまま残るため、プロジェクトディレクトリに `cd` すれば `.node-version` に基づいて自動再インストールされます。

