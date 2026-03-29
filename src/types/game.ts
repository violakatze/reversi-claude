// ゲームで使用する型定義

export type Color = 'black' | 'white';
export type Cell = Color | null;
export type Board = Cell[][];
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'settings' | 'playing' | 'finished';

// 勝敗統計
export type GameStats = {
  wins: number;
  losses: number;
  draws: number;
};

// 難易度×手番ごとの統計（キー形式: `${difficulty}_${color}`）
export type StatsRecord = {
  [key: string]: GameStats;
};

// 最後に使用した設定
export type SavedSettings = {
  difficulty: Difficulty;
  playerColor: Color;
};
