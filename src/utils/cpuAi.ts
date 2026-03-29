// CPU AIの実装

import { Board, Color, Difficulty } from '../types/game';
import {
  applyMove,
  countDiscs,
  getOpponent,
  getValidMoves,
} from './gameLogic';

/**
 * 弱: ランダムに手を選択する
 */
export const getEasyMove = (
  board: Board,
  color: Color
): [number, number] => {
  const moves = getValidMoves(board, color);
  if (moves.length === 0) throw new Error('合法手がありません');
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
};

/**
 * 中: 最も多くの石をひっくり返せる手を選択する（貪欲法）
 */
export const getMediumMove = (
  board: Board,
  color: Color
): [number, number] => {
  const moves = getValidMoves(board, color);
  if (moves.length === 0) throw new Error('合法手がありません');

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const [r, c] of moves) {
    const newBoard = applyMove(board, r, c, color);
    const counts = countDiscs(newBoard);
    const score = color === 'black' ? counts.black : counts.white;
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove;
};

// ミニマックス法の評価用の角・辺の重みテーブル
const POSITION_WEIGHTS: number[][] = [
  [120, -20, 20,  5,  5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [ 20,  -5, 15,  3,  3, 15,  -5,  20],
  [  5,  -5,  3,  3,  3,  3,  -5,   5],
  [  5,  -5,  3,  3,  3,  3,  -5,   5],
  [ 20,  -5, 15,  3,  3, 15,  -5,  20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20,  5,  5, 20, -20, 120],
];

/**
 * 盤面の評価関数（位置重み付きスコア差）
 */
const evaluateBoard = (board: Board, color: Color): number => {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === color) {
        score += POSITION_WEIGHTS[r][c];
      } else if (board[r][c] === getOpponent(color)) {
        score -= POSITION_WEIGHTS[r][c];
      }
    }
  }
  return score;
};

/**
 * アルファベータ枝刈り付きミニマックス法
 */
const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  color: Color,
  rootColor: Color
): number => {
  const currentColor = maximizing ? rootColor : getOpponent(rootColor);
  const moves = getValidMoves(board, currentColor);

  // 末端ノードまたは合法手なし
  if (depth === 0) {
    return evaluateBoard(board, rootColor);
  }

  if (moves.length === 0) {
    const opponentMoves = getValidMoves(board, getOpponent(currentColor));
    // 両者とも合法手なし（ゲーム終了）
    if (opponentMoves.length === 0) {
      return evaluateBoard(board, rootColor);
    }
    // パス（相手ターンへ）
    return minimax(board, depth - 1, alpha, beta, !maximizing, color, rootColor);
  }

  if (maximizing) {
    let maxEval = -Infinity;
    for (const [r, c] of moves) {
      const newBoard = applyMove(board, r, c, currentColor);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, color, rootColor);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // ベータ枝刈り
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const [r, c] of moves) {
      const newBoard = applyMove(board, r, c, currentColor);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, color, rootColor);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // アルファ枝刈り
    }
    return minEval;
  }
};

/**
 * 強: ミニマックス法（深さ5、アルファベータ枝刈り付き）
 */
export const getHardMove = (
  board: Board,
  color: Color
): [number, number] => {
  const moves = getValidMoves(board, color);
  if (moves.length === 0) throw new Error('合法手がありません');

  const DEPTH = 5;
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const [r, c] of moves) {
    const newBoard = applyMove(board, r, c, color);
    const score = minimax(newBoard, DEPTH - 1, -Infinity, Infinity, false, color, color);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove;
};

/**
 * 難易度に応じてCPUの手を返す
 */
export const getCpuMove = (
  board: Board,
  color: Color,
  difficulty: Difficulty
): [number, number] => {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, color);
    case 'medium':
      return getMediumMove(board, color);
    case 'hard':
      return getHardMove(board, color);
  }
};
