// ゲームロジックのユニットテスト

import { describe, it, expect } from 'vitest';

import {
  applyMove,
  countDiscs,
  createInitialBoard,
  getFlippableDiscs,
  getOpponent,
  getValidMoves,
  isValidMove,
} from '../utils/gameLogic';

describe('createInitialBoard', () => {
  it('8×8の盤面を生成する', () => {
    const board = createInitialBoard();
    expect(board).toHaveLength(8);
    board.forEach((row) => expect(row).toHaveLength(8));
  });

  it('中央4マスに初期配置が正しい', () => {
    const board = createInitialBoard();
    expect(board[3][3]).toBe('white');
    expect(board[3][4]).toBe('black');
    expect(board[4][3]).toBe('black');
    expect(board[4][4]).toBe('white');
  });

  it('初期状態では黒2個・白2個', () => {
    const board = createInitialBoard();
    const counts = countDiscs(board);
    expect(counts.black).toBe(2);
    expect(counts.white).toBe(2);
  });
});

describe('getValidMoves', () => {
  it('初期状態で黒の合法手が4つある', () => {
    const board = createInitialBoard();
    const moves = getValidMoves(board, 'black');
    expect(moves).toHaveLength(4);
  });

  it('初期状態で白の合法手が4つある', () => {
    const board = createInitialBoard();
    const moves = getValidMoves(board, 'white');
    expect(moves).toHaveLength(4);
  });

  it('初期状態の黒の合法手が正しい位置にある', () => {
    const board = createInitialBoard();
    const moves = getValidMoves(board, 'black');
    const moveSet = new Set(moves.map(([r, c]) => `${r}-${c}`));
    expect(moveSet.has('2-3')).toBe(true);
    expect(moveSet.has('3-2')).toBe(true);
    expect(moveSet.has('4-5')).toBe(true);
    expect(moveSet.has('5-4')).toBe(true);
  });
});

describe('isValidMove', () => {
  it('合法手の位置はtrueを返す', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 2, 3, 'black')).toBe(true);
  });

  it('既に石がある位置はfalseを返す', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 3, 3, 'black')).toBe(false);
  });

  it('ひっくり返せない位置はfalseを返す', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 0, 0, 'black')).toBe(false);
  });
});

describe('applyMove', () => {
  it('石を置いて正しく石がひっくり返る', () => {
    const board = createInitialBoard();
    // 黒が(2,3)に置くと(3,3)の白がひっくり返る
    const newBoard = applyMove(board, 2, 3, 'black');
    expect(newBoard[2][3]).toBe('black');
    expect(newBoard[3][3]).toBe('black'); // ひっくり返った
    expect(newBoard[3][4]).toBe('black'); // 元から黒
    expect(newBoard[4][3]).toBe('black'); // 元から黒
    expect(newBoard[4][4]).toBe('white'); // 変わらず白
  });

  it('元の盤面を変更しない（イミュータブル）', () => {
    const board = createInitialBoard();
    const originalBoard = board.map((row) => [...row]);
    applyMove(board, 2, 3, 'black');
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        expect(board[r][c]).toBe(originalBoard[r][c]);
      }
    }
  });

  it('合法でない手の場合は元の盤面を返す', () => {
    const board = createInitialBoard();
    const newBoard = applyMove(board, 0, 0, 'black');
    expect(newBoard).toBe(board);
  });
});

describe('getFlippableDiscs', () => {
  it('ひっくり返せる石の数が正しい', () => {
    const board = createInitialBoard();
    const flippable = getFlippableDiscs(board, 2, 3, 'black');
    expect(flippable).toHaveLength(1);
    expect(flippable[0]).toEqual([3, 3]);
  });

  it('既に石がある位置は空配列を返す', () => {
    const board = createInitialBoard();
    const flippable = getFlippableDiscs(board, 3, 3, 'black');
    expect(flippable).toHaveLength(0);
  });
});

describe('getOpponent', () => {
  it('黒の相手は白', () => {
    expect(getOpponent('black')).toBe('white');
  });

  it('白の相手は黒', () => {
    expect(getOpponent('white')).toBe('black');
  });
});

describe('countDiscs', () => {
  it('初期盤面のカウントが正しい', () => {
    const board = createInitialBoard();
    const counts = countDiscs(board);
    expect(counts.black).toBe(2);
    expect(counts.white).toBe(2);
  });

  it('石を置いた後のカウントが正しい', () => {
    const board = createInitialBoard();
    const newBoard = applyMove(board, 2, 3, 'black');
    const counts = countDiscs(newBoard);
    // 黒: 2 + 1（新規）+ 1（ひっくり返り）= 4
    // 白: 2 - 1（ひっくり返り）= 1
    expect(counts.black).toBe(4);
    expect(counts.white).toBe(1);
  });
});
