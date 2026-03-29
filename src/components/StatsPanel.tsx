// 難易度×手番ごとの勝敗統計パネルコンポーネント

import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { StatsRecord } from '../types/game';

type StatsPanelProps = {
  stats: StatsRecord;
  onClearStats: () => void;
};

// 表示用のラベルマッピング
const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '弱',
  medium: '中',
  hard: '強',
};

const COLOR_LABELS: Record<string, string> = {
  black: '先手（黒）',
  white: '後手（白）',
};

/**
 * 勝敗統計を表示し、リセット機能を持つコンポーネント
 */
export const StatsPanel = ({ stats, onClearStats }: StatsPanelProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // 表示行を生成
  const rows = Object.entries(stats)
    .map(([key, value]) => {
      const [difficulty, color] = key.split('_');
      return {
        key,
        difficulty: DIFFICULTY_LABELS[difficulty] ?? difficulty,
        color: COLOR_LABELS[color] ?? color,
        ...value,
      };
    })
    .filter((row) => row.wins + row.losses + row.draws > 0);

  const handleClearConfirm = () => {
    onClearStats();
    setDialogOpen(false);
  };

  if (rows.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          まだ対戦履歴がありません
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        対戦成績
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>難易度</TableCell>
              <TableCell>手番</TableCell>
              <TableCell align="center">勝</TableCell>
              <TableCell align="center">敗</TableCell>
              <TableCell align="center">引分</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell>{row.difficulty}</TableCell>
                <TableCell>{row.color}</TableCell>
                <TableCell align="center">{row.wins}</TableCell>
                <TableCell align="center">{row.losses}</TableCell>
                <TableCell align="center">{row.draws}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDialogOpen(true)}
        >
          記録をリセット
        </Button>
      </Box>

      {/* 確認ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>記録をリセットしますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            すべての対戦履歴が削除されます。この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleClearConfirm} color="error" variant="contained">
            リセット
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
