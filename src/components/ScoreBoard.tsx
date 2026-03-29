// スコアと現在のターンを表示するコンポーネント

import { Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';

import { Board, Color } from '../types/game';
import { countDiscs } from '../utils/gameLogic';

type ScoreBoardProps = {
  board: Board;
  currentTurn: Color;
  playerColor: Color;
  isCpuThinking: boolean;
};

/**
 * 石数と現在のターン状況を表示するコンポーネント
 */
export const ScoreBoard = ({
  board,
  currentTurn,
  playerColor,
  isCpuThinking,
}: ScoreBoardProps) => {
  const { black, white } = countDiscs(board);
  const isPlayerTurn = currentTurn === playerColor;
  const cpuColor = playerColor === 'black' ? 'white' : 'black';

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        minWidth: { xs: 288, sm: 384, md: 480 },
      }}
    >
      {/* スコア表示 */}
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#1a1a1a',
              mx: 'auto',
              mb: 0.5,
              boxShadow: 2,
            }}
          />
          <Typography variant="h5" fontWeight="bold">
            {black}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            黒{playerColor === 'black' ? '（あなた）' : '（CPU）'}
          </Typography>
        </Box>

        <Typography variant="h4" color="text.secondary">
          -
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              mx: 'auto',
              mb: 0.5,
              boxShadow: 2,
            }}
          />
          <Typography variant="h5" fontWeight="bold">
            {white}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            白{playerColor === 'white' ? '（あなた）' : '（CPU）'}
          </Typography>
        </Box>
      </Box>

      {/* ターン表示 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isCpuThinking ? (
          <>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              CPUが考え中...
            </Typography>
          </>
        ) : (
          <Chip
            label={
              isPlayerTurn
                ? 'あなたのターン'
                : `CPUのターン（${cpuColor === 'black' ? '黒' : '白'}）`
            }
            color={isPlayerTurn ? 'primary' : 'default'}
            size="small"
            icon={
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: currentTurn === 'black' ? '#1a1a1a' : '#f0f0f0',
                  border: currentTurn === 'white' ? '1px solid #ccc' : 'none',
                  ml: '4px !important',
                }}
              />
            }
          />
        )}
      </Box>
    </Paper>
  );
};
