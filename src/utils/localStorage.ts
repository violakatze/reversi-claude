// localStorageの読み書きユーティリティ

import { SavedSettings, StatsRecord } from '../types/game';

// localStorageのキー
const STATS_KEY = 'reversi_stats';
const SETTINGS_KEY = 'reversi_settings';

/**
 * 勝敗統計を読み込む
 */
export const loadStats = (): StatsRecord => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StatsRecord;
  } catch {
    return {};
  }
};

/**
 * 勝敗統計を保存する
 */
export const saveStats = (stats: StatsRecord): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorageが使えない環境では無視
  }
};

/**
 * 勝敗統計をすべて削除する
 */
export const clearStats = (): void => {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch {
    // localStorageが使えない環境では無視
  }
};

/**
 * 最後の設定を読み込む
 */
export const loadSettings = (): SavedSettings | null => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSettings;
  } catch {
    return null;
  }
};

/**
 * 最後の設定を保存する
 */
export const saveSettings = (settings: SavedSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // localStorageが使えない環境では無視
  }
};
