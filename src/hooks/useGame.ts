// ゲーム全体の状態管理フック

import { useCallback, useEffect, useRef, useState } from 'react';

import { getCpuMove } from '../utils/cpuAi';
import {
  applyMove,
  countDiscs,
  createInitialBoard,
  getOpponent,
  getValidMoves,
} from '../utils/gameLogic';
import {
  loadSettings,
  loadStats,
  saveSettings,
  saveStats,
  clearStats as clearStatsStorage,
} from '../utils/localStorage';
import {
  Board,
  Color,
  Difficulty,
  GamePhase,
  StatsRecord,
} from '../types/game';

type UseGameReturn = {
  // 状態
  board: Board;
  currentTurn: Color;
  playerColor: Color;
  difficulty: Difficulty;
  gamePhase: GamePhase;
  passMessage: string | null;
  stats: StatsRecord;
  isCpuThinking: boolean;
  // アクション
  startGame: (playerColor: Color, difficulty: Difficulty) => void;
  placeDisc: (row: number, col: number) => void;
  resetGame: () => void;
  clearStats: () => void;
  dismissPassMessage: () => void;
};

/**
 * ゲーム全体の状態を管理するカスタムフック
 */
export const useGame = (): UseGameReturn => {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentTurn, setCurrentTurn] = useState<Color>('black');
  const [playerColor, setPlayerColor] = useState<Color>('black');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gamePhase, setGamePhase] = useState<GamePhase>('settings');
  const [passMessage, setPassMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsRecord>(loadStats());
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  // CPUのタイマーをクリアするためのref
  const cpuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 勝敗を記録してゲームを終了する
   */
  const finishGame = useCallback(
    (finalBoard: Board, pColor: Color, diff: Difficulty) => {
      setGamePhase('finished');
      const counts = countDiscs(finalBoard);
      const playerCount = pColor === 'black' ? counts.black : counts.white;
      const cpuCount = pColor === 'black' ? counts.white : counts.black;

      const key = `${diff}_${pColor}`;
      const currentStats = loadStats();
      const current = currentStats[key] ?? { wins: 0, losses: 0, draws: 0 };

      let updated: StatsRecord;
      if (playerCount > cpuCount) {
        updated = {
          ...currentStats,
          [key]: { ...current, wins: current.wins + 1 },
        };
      } else if (playerCount < cpuCount) {
        updated = {
          ...currentStats,
          [key]: { ...current, losses: current.losses + 1 },
        };
      } else {
        updated = {
          ...currentStats,
          [key]: { ...current, draws: current.draws + 1 },
        };
      }

      saveStats(updated);
      setStats(updated);
    },
    []
  );

  /**
   * ターンを進める（合法手チェック・パス・ゲーム終了を含む）
   */
  const advanceTurn = useCallback(
    (newBoard: Board, nextColor: Color, pColor: Color, diff: Difficulty) => {
      const nextMoves = getValidMoves(newBoard, nextColor);
      const opponentMoves = getValidMoves(newBoard, getOpponent(nextColor));

      if (nextMoves.length === 0 && opponentMoves.length === 0) {
        // 両者とも合法手なし → ゲーム終了
        finishGame(newBoard, pColor, diff);
        return;
      }

      if (nextMoves.length === 0) {
        // 次のプレイヤーは合法手なし → パス
        const passedColorLabel = nextColor === 'black' ? '黒' : '白';
        setPassMessage(`${passedColorLabel}は合法手がないためパスします`);
        setCurrentTurn(getOpponent(nextColor));
        return;
      }

      setCurrentTurn(nextColor);
    },
    [finishGame]
  );

  /**
   * ゲームを開始する
   */
  const startGame = useCallback(
    (pColor: Color, diff: Difficulty) => {
      // タイマーをクリア
      if (cpuTimerRef.current) {
        clearTimeout(cpuTimerRef.current);
        cpuTimerRef.current = null;
      }

      const initialBoard = createInitialBoard();
      setBoard(initialBoard);
      setCurrentTurn('black'); // 先手は常に黒
      setPlayerColor(pColor);
      setDifficulty(diff);
      setGamePhase('playing');
      setPassMessage(null);
      setIsCpuThinking(false);

      // 設定を保存
      saveSettings({ playerColor: pColor, difficulty: diff });
    },
    []
  );

  /**
   * 石を置く（プレイヤーの操作）
   */
  const placeDisc = useCallback(
    (row: number, col: number) => {
      if (gamePhase !== 'playing') return;
      if (currentTurn !== playerColor) return;

      const validMoves = getValidMoves(board, playerColor);
      const isValid = validMoves.some(([r, c]) => r === row && c === col);
      if (!isValid) return;

      const newBoard = applyMove(board, row, col, playerColor);
      setBoard(newBoard);

      const cpuColor = getOpponent(playerColor);
      advanceTurn(newBoard, cpuColor, playerColor, difficulty);
    },
    [gamePhase, currentTurn, playerColor, board, difficulty, advanceTurn]
  );

  /**
   * ゲームをリセットして設定画面に戻る
   */
  const resetGame = useCallback(() => {
    if (cpuTimerRef.current) {
      clearTimeout(cpuTimerRef.current);
      cpuTimerRef.current = null;
    }
    setBoard(createInitialBoard());
    setGamePhase('settings');
    setPassMessage(null);
    setIsCpuThinking(false);
  }, []);

  /**
   * 統計を全削除する
   */
  const clearStats = useCallback(() => {
    clearStatsStorage();
    setStats({});
  }, []);

  /**
   * パスメッセージをクリアする
   */
  const dismissPassMessage = useCallback(() => {
    setPassMessage(null);
  }, []);

  /**
   * CPUのターン処理（useEffectで自動実行）
   */
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    if (currentTurn === playerColor) return;

    // CPUのターン
    const cpuColor = getOpponent(playerColor);
    const moves = getValidMoves(board, cpuColor);
    if (moves.length === 0) return; // パスはadvanceTurnで処理済み

    setIsCpuThinking(true);

    // 少し遅延を入れて「考え中...」を表示
    const delay = 500 + Math.random() * 300;
    cpuTimerRef.current = setTimeout(() => {
      setIsCpuThinking(false);
      const [r, c] = getCpuMove(board, cpuColor, difficulty);
      const newBoard = applyMove(board, r, c, cpuColor);
      setBoard(newBoard);
      advanceTurn(newBoard, playerColor, playerColor, difficulty);
    }, delay);

    return () => {
      if (cpuTimerRef.current) {
        clearTimeout(cpuTimerRef.current);
        cpuTimerRef.current = null;
      }
    };
  }, [gamePhase, currentTurn, playerColor, board, difficulty, advanceTurn]);

  // 初期設定をlocalStorageから読み込む
  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      setPlayerColor(saved.playerColor);
      setDifficulty(saved.difficulty);
    }
  }, []);

  return {
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
  };
};
