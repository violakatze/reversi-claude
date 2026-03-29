// リバーシボードを表示するコンポーネント

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

import { Board as BoardType, Color } from '../types/game';
import { isValidMove } from '../utils/gameLogic';
import { Cell } from './Cell';

type BoardProps = {
  board: BoardType;
  currentTurn: Color;
  playerColor: Color;
  isPlayerTurn: boolean;
  onPlaceDisc: (row: number, col: number) => void;
};

/**
 * 8×8リバーシボードを描画するコンポーネント
 */
export const Board = ({
  board,
  currentTurn,
  playerColor,
  isPlayerTurn,
  onPlaceDisc,
}: BoardProps) => {
  // ひっくり返ったセルを追跡するセット
  const [flippedCells, setFlippedCells] = useState<Set<string>>(new Set());
  const prevBoardRef = useRef<BoardType>(board);

  useEffect(() => {
    const prevBoard = prevBoardRef.current;
    const newFlipped = new Set<string>();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        // 色が変わったセルはアニメーション対象
        if (prevBoard[r][c] !== null && prevBoard[r][c] !== board[r][c] && board[r][c] !== null) {
          newFlipped.add(`${r}-${c}`);
        }
      }
    }

    prevBoardRef.current = board;

    if (newFlipped.size > 0) {
      setFlippedCells(newFlipped);
      // アニメーション後にリセット
      const timer = setTimeout(() => {
        setFlippedCells(new Set());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board]);

  const handleCellClick = (row: number, col: number) => {
    if (!isPlayerTurn) return;
    if (!isValidMove(board, row, col, playerColor)) return;
    onPlaceDisc(row, col);
  };

  // プレビュー用: プレイヤーのターン時のみ合法手を表示
  const getClickHandler = (row: number, col: number) => {
    if (!isPlayerTurn) return undefined;
    if (currentTurn !== playerColor) return undefined;
    if (!isValidMove(board, row, col, playerColor)) return undefined;
    return () => handleCellClick(row, col);
  };

  return (
    <Box
      sx={{
        display: 'inline-block',
        border: '3px solid #1a4a1a',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 3,
      }}
      role="grid"
      aria-label="リバーシボード"
    >
      {board.map((row, r) => (
        <Box key={r} sx={{ display: 'flex' }} role="row">
          {row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cell={cell}
              isFlipped={flippedCells.has(`${r}-${c}`)}
              onClick={getClickHandler(r, c)}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};
