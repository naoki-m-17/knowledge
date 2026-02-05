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

### Google Cloud SDK更新

Google Cloud SDKを最新版に更新します。

```bash
brew upgrade --cask google-cloud-sdk
```

**重要**: `gcloud components update`ではなく、Homebrew経由で更新してください。`brew install --cask`でインストールした場合は、Homebrewで管理することで、ツールの一元管理が可能になります。

もし`gcloud`コマンド側から「アップデートがある」と表示された場合は、まず`brew upgrade --cask google-cloud-sdk`を試してください。

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
# Node.jsのバージョン確認
node --version

# pnpmのバージョン確認
pnpm --version

# Firebase CLIのバージョン確認
firebase --version

# Google Cloud SDKのバージョン確認
gcloud --version

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

最初の数行に `eval "$(/opt/homebrew/bin/brew shellenv)"` が含まれている必要があります。

### gcloudコマンドが見つからない場合

Homebrewのアップデートによって、Google Cloud SDKのパス（`latest`というシンボリックリンク）が稀に変化することがあります。

まず、最新のパスを確認してください。

```bash
brew info --cask google-cloud-sdk
```

出力された情報から実際のインストールパスを確認し、`.zshrc`のGoogle Cloud SDK設定部分を更新してください。通常は `/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/` の部分を、実際のバージョン番号を含むパスに変更する必要があります。

