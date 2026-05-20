import { useState, useEffect, useCallback } from 'react'
import type { Risk } from '@/entities/game/model/types'
import { parseCredits, MIN_BET, MAX_BET } from '@/shared/lib/credits'
import type { BetMode } from '@/shared/config'

interface Props {
  balance: string
  isPlaying: boolean
  betInput: string
  rows: number
  risk: Risk
  onPlaceBet: (amount: string, rows: number, risk: Risk) => void
  mode: BetMode
}

interface UseAutoBetResult {
  numBetsInput: string
  stopProfitInput: string
  stopLossInput: string
  isAutoBetting: boolean
  currentBetCount: number
  handleBet: () => void
  handleNumBetsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleStopProfitChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleStopLossChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

import {
  DEFAULT_NUM_BETS,
  DEFAULT_STOP_PROFIT,
  DEFAULT_STOP_LOSS,
  DEFAULT_BET_COUNT,
  BET_MODES,
} from '@/shared/config'

export const useAutoBet = ({
  balance,
  isPlaying,
  betInput,
  rows,
  risk,
  onPlaceBet,
  mode,
}: Props): UseAutoBetResult => {
  const [numBetsInput, setNumBetsInput] = useState<string>(DEFAULT_NUM_BETS)
  const [stopProfitInput, setStopProfitInput] = useState<string>(DEFAULT_STOP_PROFIT)
  const [stopLossInput, setStopLossInput] = useState<string>(DEFAULT_STOP_LOSS)
  const [isAutoBetting, setIsAutoBetting] = useState<boolean>(false)
  const [currentBetCount, setCurrentBetCount] = useState<number>(DEFAULT_BET_COUNT)
  const [startBalance, setStartBalance] = useState<bigint | null>(null)

  const balanceBigInt = BigInt(balance || '0')

  useEffect(() => {
    if (mode === BET_MODES.MANUAL && isAutoBetting) {
      setIsAutoBetting(false)
    }
  }, [mode, isAutoBetting])

  useEffect(() => {
    if (!isAutoBetting) return

    const betsLeft = parseInt(numBetsInput)
    if (!isNaN(betsLeft) && betsLeft > 0 && currentBetCount >= betsLeft) {
      setIsAutoBetting(false)
      return
    }

    if (isPlaying) return

    if (startBalance !== null) {
      try {
        const stopProfit = parseCredits(stopProfitInput)
        const stopLoss = parseCredits(stopLossInput)

        const diff = balanceBigInt - startBalance

        if (stopProfit > 0n && diff >= stopProfit) {
          setIsAutoBetting(false)
          return
        }

        if (stopLoss > 0n && diff <= -stopLoss) {
          setIsAutoBetting(false)
          return
        }
      } catch (e) {

      }
    }

    try {
      const amount = parseCredits(betInput)
      if (amount < MIN_BET || amount > MAX_BET || amount > balanceBigInt) {
        setIsAutoBetting(false)
        return
      }

      onPlaceBet(betInput, rows, risk)
      setCurrentBetCount((c) => c + 1)
    } catch (e) {
      setIsAutoBetting(false)
    }
  }, [
    isAutoBetting,
    isPlaying,
    currentBetCount,
    numBetsInput,
    startBalance,
    balanceBigInt,
    stopProfitInput,
    stopLossInput,
    betInput,
    rows,
    risk,
    onPlaceBet,
  ])

  const handleNumBetsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNumBetsInput(e.target.value.replace(/[^0-9]/g, ''))
  }, [])

  const handleStopProfitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9.]/g, '')
    const dots = clean.split('.')
    if (dots.length > 2) {
      clean = dots[0] + '.' + dots.slice(1).join('')
    }
    setStopProfitInput(clean)
  }, [])

  const handleStopLossChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9.]/g, '')
    const dots = clean.split('.')
    if (dots.length > 2) {
      clean = dots[0] + '.' + dots.slice(1).join('')
    }
    setStopLossInput(clean)
  }, [])

  const handleBet = useCallback(() => {
    if (isPlaying && !isAutoBetting) return

    let amount = 0n
    try {
      amount = parseCredits(betInput)
      if (amount < MIN_BET || amount > MAX_BET) return
    } catch (e) {
      return
    }

    if (mode === BET_MODES.AUTO) {
      if (isAutoBetting) {
        setIsAutoBetting(false)
      } else {
        setIsAutoBetting(true)
        setCurrentBetCount(0)
        setStartBalance(balanceBigInt)
        onPlaceBet(amount.toString(), rows, risk)
      }
    } else {
      onPlaceBet(amount.toString(), rows, risk)
    }
  }, [mode, isAutoBetting, isPlaying, betInput, balanceBigInt, rows, risk, onPlaceBet])

  return {
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
