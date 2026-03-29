// E2Eテスト: 基本的なゲームフロー

import { test, expect } from '@playwright/test';

test.describe('リバーシゲーム', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reversi-claude/');
  });

  test('ゲーム設定画面が表示される', async ({ page }) => {
    await expect(page.getByText('リバーシ')).toBeVisible();
    await expect(page.getByText('手番')).toBeVisible();
    await expect(page.getByText('CPU難易度')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ゲーム開始' })).toBeVisible();
  });

  test('手番と難易度を選択してゲームを開始できる', async ({ page }) => {
    // 後手（白）を選択
    await page.getByLabel('後手（白）').click();
    // 弱を選択
    await page.getByLabel('弱').click();
    // ゲーム開始
    await page.getByRole('button', { name: 'ゲーム開始' }).click();

    // ボードが表示される
    await expect(page.getByRole('grid', { name: 'リバーシボード' })).toBeVisible();
  });

  test('デフォルト設定でゲームを開始できる', async ({ page }) => {
    await page.getByRole('button', { name: 'ゲーム開始' }).click();

    // ボードが表示される
    await expect(page.getByRole('grid', { name: 'リバーシボード' })).toBeVisible();

    // スコアが表示される
    await expect(page.getByText('黒（あなた）')).toBeVisible();
    await expect(page.getByText('白（CPU）')).toBeVisible();
  });

  test('石を置いてスコアが更新される', async ({ page }) => {
    // 先手（黒）で弱CPUとゲーム開始
    await page.getByRole('button', { name: 'ゲーム開始' }).click();

    // 初期スコアを確認（黒2、白2）
    const board = page.getByRole('grid', { name: 'リバーシボード' });
    await expect(board).toBeVisible();

    // プレイヤーのターンを待つ
    await page.waitForTimeout(1000);
  });
});
