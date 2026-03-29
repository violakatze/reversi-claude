// リバーシのゲームロジック

import { Board, Cell, Color } from '../types/game';

// 8方向のベクトル
const DIRECTIONS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

/**
 * 初期盤面を生成する
 * 中央4マスに初期配置
 */
export const createInitialBoard = (): Board => {
  const board: Board = Array.from({ length: 8 }, () =>
    Array<Cell>(8).fill(null)
  );
  // 初期石の配置
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
};

/**
 * 指定位置に石を置いた場合にひっくり返せる石の座標リストを返す
 */
export const getFlippableDiscs = (
  board: Board,
  row: number,
  col: number,
  color: Color
): [number, number][] => {
  // 既に石がある場合は無効
  if (board[row][col] !== null) return [];

  const opponent = getOpponent(color);
  const flippable: [number, number][] = [];

  for (const [dr, dc] of DIRECTIONS) {
    const candidates: [number, number][] = [];
    let r = row + dr;
    let c = col + dc;

    // 相手の石が続く間進む
    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
      candidates.push([r, c]);
      r += dr;
      c += dc;
    }

    // 自分の石で終端されていればひっくり返せる
    if (
      candidates.length > 0 &&
      r >= 0 &&
      r < 8 &&
      c >= 0 &&
      c < 8 &&
      board[r][c] === color
    ) {
      flippable.push(...candidates);
    }
  }

  return flippable;
};

/**
 * 指定位置が合法手かどうかを判定する
 */
export const isValidMove = (
  board: Board,
  row: number,
  col: number,
  color: Color
): boolean => {
  return getFlippableDiscs(board, row, col, color).length > 0;
};

/**
 * 指定色の全合法手を取得する
 */
export const getValidMoves = (
  board: Board,
  color: Color
): [number, number][] => {
  const moves: [number, number][] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(board, r, c, color)) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
};

/**
 * 石を置いてひっくり返した後の盤面を返す（イミュータブル）
 */
export const applyMove = (
  board: Board,
  row: number,
  col: number,
  color: Color
): Board => {
  const flippable = getFlippableDiscs(board, row, col, color);
  if (flippable.length === 0) return board;

  // 盤面のディープコピー
  const newBoard: Board = board.map((r) => [...r]);
  newBoard[row][col] = color;
  for (const [r, c] of flippable) {
    newBoard[r][c] = color;
  }
  return newBoard;
};

/**
 * 黒白それぞれの石数をカウントする
 */
export const countDiscs = (board: Board): { black: number; white: number } => {
  let black = 0;
  let white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 'black') black++;
      else if (cell === 'white') white++;
    }
  }
  return { black, white };
};

/**
 * 相手の色を返す
 */
export const getOpponent = (color: Color): Color => {
  return color === 'black' ? 'white' : 'black';
};
