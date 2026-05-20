import { useMutation } from '@tanstack/react-query'
import { bffApi } from '@/shared/api'
import type { CreateBetDto, BetResponse } from '@/entities/game/model/types'

export const usePlaceBet = () => {
  return useMutation<BetResponse, Error, CreateBetDto>({
    mutationFn: bffApi.placeBet,
  })
}
