# Firebase App Hosting - Secret Manager 権限付与マニュアル

## 概要

Firebase App HostingでSecret Managerのシークレットを使用する際、デプロイ時にアクセスできるようにするためには、（個人アカウントではなく）**Firebase App Hostingのバックエンドに権限を付与**する必要があります。

## ⚠️ よくある間違い

### ❌ 誤った方法：個人アカウントに権限を付与

```bash
# これはデプロイ時には使われないため、誤りです
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:YOUR_EMAIL@gmail.com" \
  --role="roles/secretmanager.secretAccessor"
```

**問題点：**
- 個人アカウントへの権限付与は、CLIでシークレットを取得する用途には有効ですが、**デプロイ時のビルドプロセスでは使用されません**
- デプロイ時はFirebase App Hostingのサービスアカウントがシークレットにアクセスします

### ✅ 正しい方法：Firebase App Hostingバックエンドに権限を付与

```bash
firebase apphosting:secrets:grantaccess SECRET_NAME \
  --project PROJECT_ID \
  --backend BACKEND_ID
```

## 正しい権限付与の流れ

### ステップ1: Firebase CLIのログイン状態を確認

```bash
# ログイン状態を確認
firebase login:list

# 未ログインの場合はログイン
firebase login
```

### ステップ2: Google Cloud CLIのログイン状態を確認（オプション）

CLIでシークレットを取得する場合のみ必要：

```bash
# ログイン状態を確認
gcloud auth list

# 未ログインの場合はログイン
gcloud auth login
```

### ステップ3: プロジェクトIDとバックエンドIDの確認

#### プロジェクトIDの確認方法

- Firebase Consoleから確認
- または、デプロイ済みのURLから確認：
    - URL形式: `https://{BACKEND_ID}--{PROJECT_ID}.{REGION}.hosted.app/`
    - 例: `https://develop--sutekina-omise-test.asia-east1.hosted.app/`
        - プロジェクトID: `sutekina-omise-test`
        - バックエンドID: `develop`

#### バックエンドIDの確認方法

```bash
# バックエンド一覧を取得
firebase apphosting:backends:list --project PROJECT_ID
```

### ステップ4: Secret Managerにシークレットが存在することを確認

```bash
# シークレット一覧を確認
gcloud secrets list --project PROJECT_ID

# 特定のシークレットの存在を確認
gcloud secrets describe SECRET_NAME --project PROJECT_ID
```

### ステップ5: Firebase App Hostingバックエンドに権限を付与

```bash
firebase apphosting:secrets:grantaccess SECRET_NAME \
  --project PROJECT_ID \
  --backend BACKEND_ID
```

**例：**
```bash
firebase apphosting:secrets:grantaccess NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID \
  --project sutekina-omise-test \
  --backend develop
```

### ステップ6: 権限付与の確認

```bash
# IAMポリシーを確認（サービスアカウントに権限が付与されているか確認）
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.role:roles/secretmanager.secretAccessor"
```

以下のサービスアカウントが表示されれば正しく設定されています：
- `firebase-app-hosting-compute@PROJECT_ID.iam.gserviceaccount.com`
- `service-XXXXX@gcp-sa-firebaseapphosting.iam.gserviceaccount.com`

## 完全なセットアップ例

```bash
# 1. Firebase CLIにログイン
firebase login

# 2. プロジェクトを設定（オプション）
firebase use PROJECT_ID

# 3. バックエンドIDを確認
firebase apphosting:backends:list --project PROJECT_ID

# 4. シークレットに権限を付与
firebase apphosting:secrets:grantaccess NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID \
  --project sutekina-omise-test \
  --backend develop

# 5. 他のシークレットにも同様に権限を付与（必要な場合）
firebase apphosting:secrets:grantaccess NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
  --project sutekina-omise-test \
  --backend develop
```

## apphosting.yaml の設定

`apphosting.yaml`にシークレットを定義する必要があります：

```yaml
kind: AppHostingConfiguration
schemaVersion: v1

env:
  - variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    secret: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  - variable: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
    secret: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
```

## トラブルシューティング

### エラー: "Permission 'secretmanager.versions.get' denied"

**原因：** Firebase App Hostingバックエンドに権限が付与されていない

**解決方法：**
```bash
firebase apphosting:secrets:grantaccess SECRET_NAME \
  --project PROJECT_ID \
  --backend BACKEND_ID
```

### エラー: "No currently active project"

**原因：** Firebase CLIでプロジェクトが設定されていない

**解決方法：**
```bash
# 方法1: コマンドにプロジェクトを指定
firebase apphosting:secrets:grantaccess SECRET_NAME \
  --project PROJECT_ID \
  --backend BACKEND_ID

# 方法2: プロジェクトを設定
firebase use PROJECT_ID
```

### エラー: "Missing required flag --backend or --emails"

**原因：** バックエンドIDが指定されていない

**解決方法：**
```bash
# バックエンドIDを確認
firebase apphosting:backends:list --project PROJECT_ID

# バックエンドIDを指定して実行
firebase apphosting:secrets:grantaccess SECRET_NAME \
  --project PROJECT_ID \
  --backend BACKEND_ID
```

## チェックリスト

新しいシークレットを追加する際のチェックリスト：

- [ ] Secret Managerにシークレットが作成されている
- [ ] `apphosting.yaml`にシークレットが定義されている
- [ ] Firebase CLIにログインしている
- [ ] プロジェクトIDとバックエンドIDを確認している
- [ ] `firebase apphosting:secrets:grantaccess`コマンドで権限を付与している
- [ ] デプロイして動作確認している

## 参考リンク

- [Firebase App Hosting - Secret Manager設定](https://firebase.google.com/docs/app-hosting/configure#secret-parameters)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
