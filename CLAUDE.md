# CLAUDE.md — reversi-claude

## プロジェクト概要

オセロ（リバーシ）の Web アプリケーション。プレイヤー vs CPU の 1 人用ゲーム。GitHub Pages で公開する。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | React + TypeScript |
| ビルドツール | Vite |
| UI コンポーネント | Material UI (MUI) |
| パッケージマネージャー | pnpm |
| 状態管理 | useState / useContext（不足する場合は Redux） |
| テスト（ユニット） | Vitest + @vitest/coverage-v8 |
| テスト（E2E） | Playwright |
| Linter / Formatter | ESLint + Prettier |
| デプロイ | GitHub Pages（gh-pages パッケージ） |

---

## ゲーム仕様

### 基本ルール

- 標準的なリバーシ（8×8 ボード）のルールに従う
- プレイヤー vs CPU の 1 人用対戦

### ゲーム開始時の設定

- プレイヤーは **先手（黒）** か **後手（白）** を選択できる
- CPU の **難易度を 3 段階** から選択できる

### CPU AI

| 難易度 | アルゴリズム |
|--------|-------------|
| 弱 | ランダム（合法手からランダムに選択） |
| 中 | 貪欲法（最も多くの石を返せる手を選択） |
| 強 | ミニマックス法 |

- CPU のターン中は「考え中...」の表示を行う

### ゲーム中の表示・操作

- 両プレイヤーの石数をリアルタイムで表示する
- 合法手のヒント表示は行わない（将来的な拡張ポイントとして余地を残す）
- 石が返る際にアニメーションを付ける

### パス処理

- 合法手がない場合は自動でターンをスキップする
- スキップ時はプレイヤーに通知を表示する（例：スナックバーやダイアログ）

### ゲーム終了

- 両プレイヤーとも合法手がない場合にゲーム終了
- 終了後に勝敗（勝ち / 負け / 引き分け）を表示する
- 「もう一度」ボタンで同じ設定（難易度・手番）でリスタートできる

### データ永続化（localStorage）

以下の情報を localStorage に記録・保持する：

- 最後に選択した難易度と手番
- 難易度 × 手番の組み合わせごとの勝敗数（勝ち / 負け / 引き分け）

対戦履歴・リプレイ機能は持たない。

記録の削除機能：

- 保存された勝敗記録をすべてリセットできるボタンを設ける
- 誤操作防止のため、削除前に確認ダイアログを表示する

---

## UI / デザイン

- ボード：緑色
- 石：黒・白
- ダークテーマは使用しない
- レスポンシブデザイン対応（PC・スマートフォン両対応）

---

## TypeScript コーディング規約

### 型の厳格さ

- `strict: true` を有効にする
- `any` 型は禁止。代わりに `unknown` を使用する

### 型定義

- `interface` より `type` を優先する

### 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| 変数・関数名 | camelCase | `currentBoard`, `handleClick` |
| コンポーネント名・型名 | PascalCase | `GameBoard`, `CellProps` |
| コンポーネントファイル | PascalCase.tsx | `GameBoard.tsx` |
| その他ファイル | camelCase.ts | `useGame.ts` |

### import

- パスエイリアス（`@/...`）は使用しない。相対パスで記述する
- import 順：外部ライブラリ → 内部モジュール（空行で区切る）

```ts
// 外部ライブラリ
import { useState } from 'react';
import { Box } from '@mui/material';

// 内部モジュール
import { GameBoard } from './GameBoard';
import { useGame } from '../hooks/useGame';
```

### コメント

- コメントは日本語で記述する
- 公開 API には JSDoc コメントを付ける

```ts
/**
 * オセロのゲーム状態を管理するカスタムフック
 * @param difficulty - CPU の難易度
 * @param playerColor - プレイヤーの石の色
 */
export const useGame = (difficulty: Difficulty, playerColor: Color) => { ... };
```

### export

- named export を使用する（`export default` は使わない）

```ts
// 良い
export const GameBoard = () => { ... };

// 悪い
export default GameBoard;
```

### Linter / Formatter

- ESLint + Prettier を使用する
- 特別なルールの追加なし（標準設定に従う）

---

## テスト方針

### テストの種類

| 種類 | ツール | 対象 |
|------|--------|------|
| ユニットテスト | Vitest | ゲームロジック・フック・ユーティリティ関数 |
| E2E テスト | Playwright | ブラウザ上でのゲーム操作・表示確認 |

### テストファイルの配置

- ユニットテスト：`src/__tests__/` 以下にまとめる
- E2E テスト：`e2e/` ディレクトリにまとめる

### カバレッジ

- Vitest のカバレッジ機能（`@vitest/coverage-v8`）で計測する
- 目標カバレッジ率の指定なし

### CI（GitHub Actions）

- `main` ブランチへの Push 時にユニットテスト・E2E テストを自動実行する
- ワークフローファイル：`.github/workflows/test.yml`

---

## GitHub Pages へのデプロイ

1. `vite.config.ts` に `base: '/reversi-claude/'` を設定
2. `gh-pages` パッケージを使用
3. `pnpm run deploy` でデプロイ

```ts
// vite.config.ts
export default defineConfig({
  base: '/reversi-claude/',
  // ...
})
```

---

## その他

- `README.md` と `.gitignore` を適宜作成する
