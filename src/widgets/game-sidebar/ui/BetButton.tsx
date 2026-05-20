import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { BET_MODES, BetMode } from '@/shared/config'
import { ZERO, LABELS, STYLES } from '../model/constants'

interface Props {
  mode: BetMode
  isAutoBetting: boolean
  isPlaying: boolean
  disabled: boolean
  limitNumBets: number
  currentBetCount: number
}

export const BetButton = ({
  mode,
  isAutoBetting,
  isPlaying,
  disabled,
  limitNumBets,
  currentBetCount,
}: Props) => {
  const getButtonClassName = () => {
    if (mode === BET_MODES.AUTO && isAutoBetting) {
      return STYLES.STOP_AUTO_BET_CLASS
    }
    if (isPlaying) {
      return STYLES.PLAYING_CLASS
    }
    return ''
  }

  const renderContent = () => {
    if (mode === BET_MODES.AUTO) {
      if (isAutoBetting) {
        if (limitNumBets > ZERO) {
          return `${LABELS.STOP} (${currentBetCount}/${limitNumBets})`
        }
        return `${LABELS.STOP} (${currentBetCount})`
      }
      return LABELS.START_AUTO_BET
    }

    if (isPlaying) {
      return (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin h-4 w-4" />
          {LABELS.PLAYING}
        </span>
      )
    }

    return LABELS.BET
  }

  return (
    <Button
      type="submit"
      variant="primary"
      disabled={disabled}
      className={getButtonClassName()}
    >
      {renderContent()}
    </Button>
  )
}
