// useGameフックのユニットテスト

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useGame } from '../hooks/useGame';

// localStorageのモック
beforeEach(() => {
  localStorage.clear();
  vi.clearAllTimers();
});

describe('useGame', () => {
  it('初期状態が正しい', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.gamePhase).toBe('settings');
    expect(result.current.isCpuThinking).toBe(false);
    expect(result.current.passMessage).toBeNull();
  });

  it('startGameでゲームが開始される', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame('black', 'easy');
    });

    expect(result.current.gamePhase).toBe('playing');
    expect(result.current.playerColor).toBe('black');
    expect(result.current.difficulty).toBe('easy');
    expect(result.current.currentTurn).toBe('black');
  });

  it('resetGameで設定画面に戻る', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame('black', 'easy');
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gamePhase).toBe('settings');
  });

  it('clearStatsで統計がリセットされる', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.clearStats();
    });

    expect(result.current.stats).toEqual({});
  });

  it('dismissPassMessageでパスメッセージがクリアされる', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.dismissPassMessage();
    });

    expect(result.current.passMessage).toBeNull();
  });
});
