import { Button } from '@/shared/ui/button'

interface Props {
  onHalf: () => void
  onDouble: () => void
  onMax: () => void
  disabled?: boolean
}

export const QuickBetControls = ({ onHalf, onDouble, onMax, disabled }: Props) => {
  return (
    <div className="flex justify-between gap-[8px]">
      <Button
        type="button"
        variant="quickBet"
        onClick={onHalf}
        disabled={disabled}
        className="flex-1"
      >
        1/2
      </Button>
      <Button
        type="button"
        variant="quickBet"
        onClick={onDouble}
        disabled={disabled}
        className="flex-1"
      >
        2X
      </Button>
      <Button
        type="button"
        variant="quickBet"
        onClick={onMax}
        disabled={disabled}
        className="flex-1"
      >
        MAX
      </Button>
    </div>
  )
}
