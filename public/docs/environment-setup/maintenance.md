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

Firebase CLIを最新版に更新します。

```bash
brew upgrade firebase-cli
```

### Volta更新

Voltaはセルフアップデート機能を搭載しています。数ヶ月に一度、以下で最新版に更新します。

```bash
volta --version  # 現在のバージョンを確認
volta upgrade    # 最新版へアップデート
```

**意味**: Volta本体を最新版に更新します。Node.jsやpnpmのバージョンは各プロジェクトの `package.json` で固定されているため、この更新だけでプロジェクトの動作に影響しません。

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
# Voltaのバージョン確認
volta --version

# Node.jsのバージョン確認
node --version

# pnpmのバージョン確認
pnpm --version

# Firebase CLIのバージョン確認
firebase --version

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

最初の数行に `eval "$(/opt/homebrew/bin/brew shellenv)"` が含まれている必要があります。Voltaを使用している場合は、`VOLTA_HOME` と `PATH` に `$VOLTA_HOME/bin` が含まれていることも確認してください。

### Node.js環境の完全リセットが必要な場合

Voltaは `~/.volta/` に全てを格納しているため、万が一開発環境が壊れた際は、このフォルダを削除するだけでNode環境だけを完全に初期化できます。OSやHomebrewには影響しません。

```bash
rm -rf ~/.volta
```

その後、[Homebrewとシェル環境のセットアップ](./homebrew-shell-setup.md) の Volta インストール手順から再実行してください。

