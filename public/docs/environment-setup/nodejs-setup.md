# Node.js環境構築

このドキュメントでは、Node.jsとpnpmのセットアップを行います。

## Node.js の導入

fnmを使用してNode.jsのLTS（Long Term Support）版をインストールします。

```bash
fnm install --lts # 安定版(LTS)をダウンロード
fnm use --lts     # 現在のセッションでそのバージョンを使用
```

**意味**: 
- `fnm install --lts`: 最新のLTS版Node.jsをダウンロードします。
- `fnm use --lts`: 現在のターミナルセッションでLTS版を使用します。

**確認方法**: 以下のコマンドでNode.jsのバージョンが表示されれば成功です。

```bash
node --version
npm --version
```

## Corepack による pnpm 有効化

Node.jsに内蔵されているCorepack機能を使用してpnpmを有効化します。

```bash
corepack enable                      # Node.js内蔵のパッケージマネージャー管理機能をONにする
corepack prepare pnpm@latest --activate # 最新のpnpmを準備し、デフォルトで使用する
```

**Corepackの役割**: これにより、`npm install -g pnpm` という古い手法を使わずに、Node.jsの機能としてpnpmを安全に呼び出せます。

**確認方法**: 以下のコマンドでpnpmのバージョンが表示されれば成功です。

```bash
pnpm --version
```

## プロジェクトでの使用

プロジェクトごとに異なるNode.jsバージョンを使用する場合は、プロジェクトのルートディレクトリに `.node-version` ファイルを作成してください。

```bash
# プロジェクトディレクトリで実行
echo "22" > .node-version
```

これにより、`cd`でそのディレクトリに移動した際に、自動的に指定したNode.jsバージョンに切り替わります（`.zshrc`で`fnm env --use-on-cd`を設定している場合）。

## 次のステップ

Node.js環境の構築が完了したら、必要に応じて[Firebase設定](./firebase-setup.md)に進んでください。

