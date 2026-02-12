# Node.js環境構築

このドキュメントでは、Voltaを使用してNode.jsとpnpmのセットアップを行います。

## Node.js の導入

Voltaを使用してNode.jsのLTS（Long Term Support）版をインストールします。Voltaは [Homebrewとシェル環境のセットアップ](./homebrew-shell-setup.md) で既にインストール済みである必要があります。

```bash
volta install node@lts    # 最新のLTS版をダウンロードし、デフォルトに設定
```

**意味**: 
- `volta install node@lts`: 最新のLTS版Node.jsをダウンロードし、デフォルトのバージョンとして設定します。
- プロジェクトごとに異なるバージョンが必要な場合は、後述の `volta pin` で自動的に切り替わります。

**確認方法**: 以下のコマンドでNode.jsとnpmのバージョンが表示されれば成功です。

```bash
node --version
npm --version
```

## pnpm の導入

Voltaを使用してpnpmをインストールします。Node.jsとは別に、pnpmのバージョンもプロジェクトごとに固定可能です。

```bash
volta install pnpm
```

**Voltaによるpnpm管理のメリット**: Node.jsだけでなく、pnpmのバージョンもプロジェクトごとに固定できるため、パッケージインストール時の挙動のズレを防げます。

**確認方法**: 以下のコマンドでpnpmのバージョンが表示されれば成功です。

```bash
pnpm --version
```

## プロジェクトでの使用

プロジェクトで使用するNode.js（およびpnpm）のバージョンを固定するには、プロジェクトのルートディレクトリで `volta pin` コマンドを実行します。

```bash
# プロジェクトディレクトリで実行
volta pin node@22
volta pin pnpm@9
```

**意味**: `package.json` に `volta` フィールドが自動追記され、チーム全員が同じバージョンで開発できます。

**生成される package.json の例**:

```json
{
  "volta": {
    "node": "22.12.0",
    "pnpm": "9.15.0"
  }
}
```

これにより、プロジェクトディレクトリに `cd` した際に、Voltaが自動的に指定したNode.jsとpnpmのバージョンに切り替えます。**「.node-version を作り忘れる」「切り替え忘れる」という事故が物理的に発生しなくなります。**

## 次のステップ

Node.js環境の構築が完了したら、必要に応じて[Firebase設定](./firebase-setup.md)に進んでください。
