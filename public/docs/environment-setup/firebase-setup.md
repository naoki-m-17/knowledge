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

## 補足: Google Cloud SDK（gcloudコマンド）について

この環境構築では **Google Cloud SDK（gcloudコマンド）のインストールは不要** です。

Firebase CLIは自身にバンドルされたライブラリを通じてGoogle CloudのAPI（Secret Manager API、IAM APIなど）を直接呼び出すため、`gcloud`コマンドのインストールは不要です。Secret Managerのアクセサー権限付与など、Firebase App Hostingに関連する主要な操作はFirebase CLIだけで完結します。

例えば、Secret Managerの権限付与は以下のFirebase CLIコマンドで実行できます：

```bash
firebase apphosting:secrets:grantaccess SECRET_NAME \
  --project PROJECT_ID \
  --backend BACKEND_ID
```

詳しくは [Secret Manager 権限付与マニュアル](../firebase/secret-manager-setup.md) を参照してください。

**注意**: 将来的にGoogle Cloudの詳細なIAM操作やADC（Application Default Credentials）の設定が必要になった場合は、`brew install --cask google-cloud-sdk` で後からインストールできます。

## 次のステップ

Firebase設定が完了したら、[メンテナンス](./maintenance.md)の習慣を確認してください。

