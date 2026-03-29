// ボードの1マスを表示するコンポーネント

import { Box, SxProps, Theme } from '@mui/material';

import { Cell as CellType } from '../types/game';

type CellProps = {
  cell: CellType;
  // アニメーション用: このターンでひっくり返ったセルかどうか
  isFlipped?: boolean;
  onClick?: () => void;
};

/**
 * ボードの1マスを描画するコンポーネント
 */
export const Cell = ({ cell, isFlipped = false, onClick }: CellProps) => {
  const cellSx: SxProps<Theme> = {
    width: { xs: 36, sm: 48, md: 60 },
    height: { xs: 36, sm: 48, md: 60 },
    backgroundColor: '#2d6a2d',
    border: '1px solid #1a4a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
    '&:hover': onClick
      ? {
          backgroundColor: '#3a7a3a',
        }
      : {},
    perspective: '200px',
  };

  const discSx: SxProps<Theme> = {
    width: '75%',
    height: '75%',
    borderRadius: '50%',
    backgroundColor: cell === 'black' ? '#1a1a1a' : '#f0f0f0',
    boxShadow:
      cell === 'black'
        ? '2px 2px 4px rgba(0,0,0,0.5)'
        : '2px 2px 4px rgba(0,0,0,0.3)',
    // ひっくり返るアニメーション
    animation: isFlipped ? 'flipDisc 0.4s ease-in-out' : 'none',
    '@keyframes flipDisc': {
      '0%': { transform: 'rotateY(0deg)', opacity: 1 },
      '50%': { transform: 'rotateY(90deg)', opacity: 0.5 },
      '100%': { transform: 'rotateY(180deg)', opacity: 1 },
    },
  };

  return (
    <Box sx={cellSx} onClick={onClick}>
      {cell !== null && <Box sx={discSx} />}
    </Box>
  );
};
