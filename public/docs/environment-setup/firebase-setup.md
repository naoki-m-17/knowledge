# Firebase設定

このドキュメントでは、Firebase App HostingやSecret Managerを使用する場合の認証設定を行います。

## Firebase CLI の認証

Firebase CLIを使用するための認証を行います。

```bash
# ブラウザが開くので、Firebaseアカウントでログイン
firebase login

# プロジェクト一覧が表示されれば成功
firebase projects:list
```

**意味**: Firebase CLIを使用するための認証を行います。認証情報は `~/.config/configstore/` に自動保存されます。

**確認方法**: `firebase projects:list` コマンドでプロジェクト一覧が表示されれば認証成功です。

## Google Cloud SDK の認証

Google Cloud SDKを使用するための認証を行います。

```bash
# 1. gcloud自体のログイン
gcloud auth login

# 2. ローカル開発でのプログラム用認証（ADC）の設定
gcloud auth application-default login
```

**意味**: 
- `gcloud auth login`: Google Cloudの操作に必要な認証を行います。
- `gcloud auth application-default login`: ローカル開発環境（Next.jsからFirebase Admin SDKを使う場合など）での認証を設定します。認証情報は `~/.config/gcloud/application_default_credentials.json` に自動保存されます。

**確認方法**: 以下のコマンドで認証状態を確認できます。

```bash
gcloud auth list
```

## 重要な注意事項

### GOOGLE_APPLICATION_CREDENTIALS環境変数は設定しない

古い環境では `GOOGLE_APPLICATION_CREDENTIALS` 環境変数でJSON鍵ファイルを指定する方法がありましたが、**新環境では不要です**。

上記の `gcloud auth application-default login` を実行することで、Firebaseのライブラリが自動的に認証情報を見つけてくれます。セキュリティ的にも、ディレクトリ構成のクリーンさにおいても、この方法が推奨されます。

### Firebase CLIとGoogle Cloud SDKの両方が必要

Firebase App HostingでSecret ManagerのIAMを操作する際は、Firebase CLIとGoogle Cloud SDKの両方がインストールされている必要があります。

- **Firebase CLI**: App Hostingのバックエンド作成やデプロイ、シークレットの設定（`firebase apphosting:secrets:set`など）に使用します。
- **Google Cloud SDK**: Firebase CLIが内部的にGoogle Cloudの権限を利用したり、CLIで解決できない詳細なIAM操作を行ったりするために必要です。

## 次のステップ

Firebase設定が完了したら、[メンテナンス](./maintenance.md)の習慣を確認してください。

