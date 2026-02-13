# Firebase設定

このドキュメントでは、Firebase App HostingやSecret Managerを使用する場合の認証設定を行います。

## Firebase CLI の利用

Firebase CLI は **brew ではインストールしません**。Node.js 由来のツールを brew で入れると、brew が Node を依存として自動インストールし、fnm で管理している Node と競合するためです。

代わりに、以下のいずれかの方法で利用します。

### 方法A: プロジェクトの devDependencies として導入（推奨）

```bash
pnpm add -D firebase-tools
```

その後、プロジェクト内で以下で実行します。

```bash
pnpm exec firebase login
pnpm exec firebase projects:list
```

`package.json` の `scripts` に `"firebase": "firebase"` を追加すれば、`pnpm firebase` でも実行できます。

### 方法B: 都度 pnpm dlx で実行

グローバルインストールなしで、必要なときだけ最新版を取得して実行します。

```bash
pnpm dlx firebase-tools login
pnpm dlx firebase-tools projects:list
```

### firebase エイリアス（推奨）: 方法A・Bを意識せず常に firebase で実行

方法A・Bのどちらを使うか切り替える手間を省くため、**エイリアス** を設定することを推奨します。`npx firebase-tools` は「プロジェクトに firebase-tools があればそれを優先し、なければ一時的にリモートから取得して実行する」挙動をするため、エイリアスにすることで**インストールの有無を気にせず常に `firebase` と打つだけで実行**できます。

`.zshrc` のエイリアス欄に以下を追加してください（[Homebrewとシェル環境のセットアップ](./homebrew-shell-setup.md) の「### 4. 便利なエイリアス」参照）。

```bash
alias firebase='npx firebase-tools'
```

これにより、`firebase login` や `firebase apphosting:secrets:grantaccess` などのサブコマンドを、プロジェクト内・外を問わず `firebase` と打つだけで実行できます。`pnpm add -D firebase-tools` 済みのプロジェクトではローカルのバイナリが使われ、未導入の場合はその都度リモートから取得されて実行されます。

## Firebase CLI の認証

Firebase CLI を使用するための認証を行います。

```bash
# 方法A（プロジェクトに firebase-tools を add した場合）
pnpm exec firebase login

# 方法B（一時的に使う場合）
pnpm dlx firebase-tools login

# エイリアス（alias firebase='npx firebase-tools'）を設定している場合
firebase login
```

**意味**: ブラウザが開き、Firebaseアカウントでログインします。認証情報は `~/.config/configstore/` に自動保存されます。

**確認方法**: `firebase projects:list`（エイリアス利用時）、または `pnpm exec firebase projects:list`（方法A）でプロジェクト一覧が表示されれば認証成功です。

## 補足: Google Cloud SDK（gcloudコマンド）について

この環境構築では **Google Cloud SDK（gcloudコマンド）のインストールは不要** です。

Firebase CLIは自身にバンドルされたライブラリを通じてGoogle CloudのAPI（Secret Manager API、IAM APIなど）を直接呼び出すため、`gcloud`コマンドのインストールは不要です。Secret Managerのアクセサー権限付与など、Firebase App Hostingに関連する主要な操作はFirebase CLIだけで完結します。

例えば、Secret Managerの権限付与は以下のFirebase CLIコマンドで実行できます。`firebase` の部分は、上記エイリアスを設定している場合はそのまま使え、未設定の場合は `pnpm exec firebase`（方法A）または `pnpm dlx firebase-tools`（方法B）に読み替えてください。

```bash
firebase apphosting:secrets:grantaccess SECRET_NAME \
  --project PROJECT_ID \
  --backend BACKEND_ID
```

- **方法A（pnpm add 済みのプロジェクト内）**: `pnpm exec firebase apphosting:secrets:grantaccess ...` で実行
- **方法B（一時利用）**: `pnpm dlx firebase-tools apphosting:secrets:grantaccess ...` で実行
- **エイリアス利用時**: `firebase apphosting:secrets:grantaccess ...` と打つだけで、プロジェクトにあればローカル・なければリモート取得で実行

詳しくは [Secret Manager 権限付与マニュアル](../firebase/secret-manager-setup.md) を参照してください。

**注意**: 将来的にGoogle Cloudの詳細なIAM操作やADC（Application Default Credentials）の設定が必要になった場合は、`brew install --cask google-cloud-sdk` で後からインストールできます。

## 次のステップ

Firebase設定が完了したら、[メンテナンス](./maintenance.md)の習慣を確認してください。

