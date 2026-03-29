// アプリケーションのルートコンポーネント

import { useCallback } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';

import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { GameResult } from './components/GameResult';
import { GameSettings } from './components/GameSettings';
import { ScoreBoard } from './components/ScoreBoard';
import { Color, Difficulty } from './types/game';

/**
 * アプリケーションのルートコンポーネント
 * useGameフックを使ってゲーム全体を制御する
 */
export const App = () => {
  const {
    board,
    currentTurn,
    playerColor,
    difficulty,
    gamePhase,
    passMessage,
    stats,
    isCpuThinking,
    startGame,
    placeDisc,
    resetGame,
    clearStats,
    dismissPassMessage,
  } = useGame();

  const handleStartGame = useCallback(
    (pColor: Color, diff: Difficulty) => {
      startGame(pColor, diff);
    },
    [startGame]
  );

  const handlePlayAgain = useCallback(() => {
    startGame(playerColor, difficulty);
  }, [startGame, playerColor, difficulty]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 設定画面 */}
      {gamePhase === 'settings' && (
        <GameSettings
          stats={stats}
          onStartGame={handleStartGame}
          onClearStats={clearStats}
        />
      )}

      {/* ゲーム画面 */}
      {(gamePhase === 'playing' || gamePhase === 'finished') && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 3,
            px: 2,
          }}
        >
          <ScoreBoard
            board={board}
            currentTurn={currentTurn}
            playerColor={playerColor}
            isCpuThinking={isCpuThinking}
          />

          <Board
            board={board}
            currentTurn={currentTurn}
            playerColor={playerColor}
            isPlayerTurn={currentTurn === playerColor && !isCpuThinking}
            onPlaceDisc={placeDisc}
          />
        </Box>
      )}

      {/* ゲーム終了ダイアログ */}
      {gamePhase === 'finished' && (
        <GameResult
          board={board}
          playerColor={playerColor}
          onPlayAgain={handlePlayAgain}
          onGoToSettings={resetGame}
        />
      )}

      {/* パス通知スナックバー */}
      <Snackbar
        open={passMessage !== null}
        autoHideDuration={3000}
        onClose={dismissPassMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled">
          {passMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
