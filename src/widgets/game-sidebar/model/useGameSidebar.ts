import { useState, useCallback } from 'react'
import type { Risk, GameConfig } from '@/entities/game/model/types'
import { useBetForm, useAutoBet } from '@/features/place-bet'
import { BET_MODES, RISK_LEVELS, BetMode } from '@/shared/config'

interface Props {
  config: GameConfig
  balance: string
  isPlaying: boolean
  onPlaceBet: (amount: string, rows: number, risk: Risk) => void
}

export const useGameSidebar = ({
  config,
  balance,
  isPlaying,
  onPlaceBet,
}: Props) => {
  const [mode, setMode] = useState<BetMode>(BET_MODES.MANUAL)
  const [risk, setRisk] = useState<Risk>(RISK_LEVELS.HIGH)
  const [rows, setRows] = useState<number>(12)

  const handleRowsChange = useCallback((val: number | readonly number[]) => {
    const v = Array.isArray(val) ? val[0] : val
    if (typeof v === 'number') {
      setRows(v)
    }
  }, [])

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const {
    form,
    betInput,
    handleHalf,
    handleDouble,
    handleMax,
    handleInputChange,
  } = useBetForm({
    balance,
    disabled: mode === BET_MODES.AUTO ? false : isPlaying,
  })

  const {
    numBetsInput,
    stopProfitInput,
    stopLossInput,
    isAutoBetting,
    currentBetCount,
    handleBet,
    handleNumBetsChange,
    handleStopProfitChange,
    handleStopLossChange,
  } = useAutoBet({
    balance,
    isPlaying,
    betInput,
    rows,
    risk,
    onPlaceBet,
    mode,
  })

  return {
    mode,
    setMode,
    risk,
    setRisk,
    rows,
    handleRowsChange,
    handleFullscreenToggle,
    form,
    betInput,
    handleHalf,
    handleDouble,
    handleMax,
    handleInputChange,
    numBetsInput,
    stopProfitInput,
    stopLossInput,
    isAutoBetting,
    currentBetCount,
    handleBet,
    handleNumBetsChange,
    handleStopProfitChange,
    handleStopLossChange,
  }
}
