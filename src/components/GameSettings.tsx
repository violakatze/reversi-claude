// ゲーム開始前の設定画面コンポーネント

import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { Color, Difficulty, SavedSettings, StatsRecord } from '../types/game';
import { loadSettings } from '../utils/localStorage';
import { StatsPanel } from './StatsPanel';

type GameSettingsProps = {
  stats: StatsRecord;
  onStartGame: (playerColor: Color, difficulty: Difficulty) => void;
  onClearStats: () => void;
};

/**
 * ゲーム設定画面コンポーネント
 */
export const GameSettings = ({
  stats,
  onStartGame,
  onClearStats,
}: GameSettingsProps) => {
  // 前回の設定を初期値として使用
  const savedSettings: SavedSettings | null = loadSettings();

  const [playerColor, setPlayerColor] = useState<Color>(
    savedSettings?.playerColor ?? 'black'
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    savedSettings?.difficulty ?? 'medium'
  );

  const handleStart = () => {
    onStartGame(playerColor, difficulty);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 3,
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 4 }}>
        リバーシ
      </Typography>

      <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 400 }}>
        {/* 手番選択 */}
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend">
            <Typography variant="subtitle1" fontWeight="bold">
              手番
            </Typography>
          </FormLabel>
          <RadioGroup
            value={playerColor}
            onChange={(e) => setPlayerColor(e.target.value as Color)}
            row
          >
            <FormControlLabel
              value="black"
              control={<Radio />}
              label="先手（黒）"
            />
            <FormControlLabel
              value="white"
              control={<Radio />}
              label="後手（白）"
            />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ mb: 3 }} />

        {/* 難易度選択 */}
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend">
            <Typography variant="subtitle1" fontWeight="bold">
              CPU難易度
            </Typography>
          </FormLabel>
          <RadioGroup
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            row
          >
            <FormControlLabel value="easy" control={<Radio />} label="弱" />
            <FormControlLabel value="medium" control={<Radio />} label="中" />
            <FormControlLabel value="hard" control={<Radio />} label="強" />
          </RadioGroup>
        </FormControl>

        {/* ゲーム開始ボタン */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<PlayArrowIcon />}
          onClick={handleStart}
        >
          ゲーム開始
        </Button>
      </Paper>

      {/* 統計パネル */}
      <Paper elevation={2} sx={{ p: 3, width: '100%', maxWidth: 400 }}>
        <StatsPanel stats={stats} onClearStats={onClearStats} />
      </Paper>
    </Box>
  );
};
