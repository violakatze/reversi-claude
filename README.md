# reversi-claude

オセロ（リバーシ）の Web アプリケーションです。プレイヤー vs CPU の 1 人用対戦ゲームです。

## プレイ

GitHub Pages: https://violakatze.github.io/reversi-claude/

## 機能

- 先手（黒）/ 後手（白）の選択
- CPU 難易度 3 段階（弱 / 中 / 強）
- リアルタイムスコア表示
- 石が返る際のアニメーション
- 合法手がない場合の自動パス通知
- 難易度 × 手番ごとの勝敗記録（localStorage 保存）
- レスポンシブ対応

## 技術スタック

- React + TypeScript
- Vite
- Material UI
- Vitest（ユニットテスト）
- Playwright（E2E テスト）

## 開発

### 必要環境

- Node.js 20.19+ または 22.12+
- pnpm

### セットアップ

```bash
pnpm install
```

### 開発サーバー起動

```bash
pnpm dev
```

http://localhost:5173/reversi-claude/ をブラウザで開く。

### テスト

```bash
# ユニットテスト
pnpm test

# カバレッジ付き
pnpm test:coverage

# E2E テスト（事前に開発サーバーの起動が必要）
pnpm test:e2e
```

### Lint / Format

```bash
pnpm lint
pnpm format
```

## デプロイ

GitHub Pages へのデプロイ：

```bash
pnpm deploy
```

`pnpm build` 後に `gh-pages` で `dist/` を公開します。
