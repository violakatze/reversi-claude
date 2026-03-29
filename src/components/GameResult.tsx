// ゲーム終了時の結果表示コンポーネント

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import SettingsIcon from '@mui/icons-material/Settings';

import { Board, Color } from '../types/game';
import { countDiscs } from '../utils/gameLogic';

type GameResultProps = {
  board: Board;
  playerColor: Color;
  onPlayAgain: () => void;
  onGoToSettings: () => void;
};

/**
 * ゲーム終了時の勝敗ダイアログコンポーネント
 */
export const GameResult = ({
  board,
  playerColor,
  onPlayAgain,
  onGoToSettings,
}: GameResultProps) => {
  const { black, white } = countDiscs(board);
  const playerCount = playerColor === 'black' ? black : white;
  const cpuCount = playerColor === 'black' ? white : black;

  // 勝敗判定
  let resultText: string;
  let resultColor: string;
  if (playerCount > cpuCount) {
    resultText = 'あなたの勝ち！';
    resultColor = '#1976d2';
  } else if (playerCount < cpuCount) {
    resultText = 'CPUの勝ち';
    resultColor = '#d32f2f';
  } else {
    resultText = '引き分け';
    resultColor = '#757575';
  }

  return (
    <Dialog open={true} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Typography variant="h5" fontWeight="bold" color={resultColor}>
          {resultText}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 2 }}>
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

          <Typography variant="h4" color="text.secondary" sx={{ mt: 1 }}>
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
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<ReplayIcon />}
          onClick={onPlayAgain}
        >
          もう一度
        </Button>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={onGoToSettings}
        >
          設定に戻る
        </Button>
      </DialogActions>
    </Dialog>
  );
};
