# Gemini Nano 翻訳・要約ツール

選択したテキストを日本語に翻訳・要約するChrome拡張機能です。Chrome内蔵のGemini Nano AIモデルを使用し、完全にローカルで動作します。

## 機能

- **翻訳機能**: 選択したテキストを日本語に翻訳
- **要約機能**: 選択したテキストを日本語で要約（tldr形式）
- **ローカル処理**: Gemini Nano APIを使用してオフラインで動作
- **モデルダウンロード**: 初回使用時に必要なAIモデルを自動ダウンロード
- **キャッシュ機能**: 翻訳・要約結果をキャッシュして高速化

## インストール方法

### 1. Chromeのセットアップ

この拡張機能は、Chrome内蔵AIを使用します。Chrome 138以降で利用可能です。

1. Chromeを最新版（138以降）にアップデート
   - 通常のChrome: [chrome://settings/help](chrome://settings/help) でバージョンを確認
   - または [Chrome Canary](https://www.google.com/chrome/canary/)を使用

**注意**: 
- Chrome 138以降で正式に利用可能です
- APIの仕様は変更される可能性があります

### 2. Bunのインストール

このプロジェクトは[Bun](https://bun.sh)を使用しています。以下の方法でインストールしてください：

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

**その他の方法:**
- Homebrew (macOS): `brew install bun`
- npm: `npm install -g bun`

インストール後、ターミナルを再起動するか、以下を実行してください：
```bash
source ~/.bashrc  # または ~/.zshrc
```

インストールの確認：
```bash
bun --version
```

### 3. 拡張機能のビルド

```bash
# 依存関係のインストール
bun install

# ビルド
./build.sh
```

### 4. 拡張機能のインストール

1. Chrome で `chrome://extensions/` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `dist` ディレクトリを選択

## 使い方

1. 任意のウェブページでテキストを選択
2. 自動的に表示されるポップアップを確認
3. 以下のいずれかをクリック：
   - **「翻訳する」**: 選択したテキストを日本語に翻訳
   - **「要約する」**: 選択したテキストを日本語で要約
4. 結果がポップアップ内に表示されます

### 初回使用時

初めて使用する際は、AIモデルのダウンロードが必要です：

1. 「翻訳モデルをダウンロード」または「要約モデルをダウンロード」ボタンが表示されます
2. ボタンをクリックしてモデルをダウンロード（数分かかる場合があります）
3. ダウンロード完了後、通常の「翻訳する」「要約する」ボタンが表示されます

## 開発

### 必要な環境

- Bun 1.0以降（高速なJavaScript/TypeScriptランタイム）
  - Node.jsの代替として使用
  - TypeScriptをネイティブサポート
  - 高速なパッケージマネージャーを内蔵

### 開発コマンド

```bash
# 依存関係のインストール
bun install

# ビルド
./build.sh
# または
bun run build

# テスト
bun test

# アイコン生成（macOSのみ）
./create-icons.sh
```

### トラブルシューティング

- **「翻訳機能は利用できません」と表示される場合**:
  - Chromeのバージョンが138以降であることを確認
  - Chromeを再起動

- **モデルダウンロードが終わらない場合**:
  - 十分なストレージ容量があるか確認（4GB以上推奨）
  - ネットワーク接続を確認
  - Chrome開発者ツールのコンソールでエラーを確認

## プロジェクト構造

```text
gemini-nano-translator/
├── src/
│   ├── background/          # バックグラウンドサービスワーカー
│   ├── content/            # コンテンツスクリプト
│   │   ├── components/     # Reactコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   └── styles/         # CSSスタイル
│   ├── types/              # TypeScript型定義
│   └── utils/              # ユーティリティ関数
├── public/
│   └── icons/              # 拡張機能アイコン
├── dist/                   # ビルド出力
└── manifest.json           # Chrome拡張機能マニフェスト
```

## 技術スタック

- **ランタイム**: Bun
- **フレームワーク**: React 18
- **言語**: TypeScript
- **スタイリング**: CSS
- **API**: Chrome Built-in AI
  - Translator API（Chrome 138で正式リリース）
  - Summarizer API（Chrome 138で正式リリース）
- **アーキテクチャ**: Chrome Extension Manifest V3

## システム要件

- **OS**: Windows 10/11, macOS, Linux
- **Chrome**: Chrome 138以降（安定版）
- **ハードウェア**:
  - 4GB以上の空きストレージ（モデルダウンロード用）
  - GPU推奨（より高速な処理のため）
  - 4GB以上のRAM

## APIステータス

この拡張機能で使用しているChrome Built-in AI APIの現在のステータス：

| API | ステータス | 利用可能バージョン | 備考 |
|-----|----------|------------------|------|
| Translator API | 正式リリース | Chrome 138以降 | - |
| Summarizer API | 正式リリース | Chrome 138以降 | - |

詳細は[Chrome Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in-apis)を参照してください。

## ライセンス

MIT
