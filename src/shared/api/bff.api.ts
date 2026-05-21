import type {
  BetListResponseDto,
  BetResponseDto,
  CreateBetDto,
  GameConfigDto,
  UserDto,
} from './types';

export class BffError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'BffError';
  }
}

export const bffApi = {
  getGameConfig: async (): Promise<GameConfigDto> => {
    const res = await fetch('/api/game/config');
    if (!res.ok) throw new BffError(res.status, 'Failed to fetch config');
    return res.json();
  },

  getMe: async (): Promise<UserDto> => {
    const res = await fetch('/api/user/me');
    if (!res.ok) throw new BffError(res.status, 'Failed to fetch user');
    return res.json();
  },

  placeBet: async (dto: CreateBetDto): Promise<BetResponseDto> => {
    const res = await fetch('/api/bets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new BffError(res.status, error.message || 'Failed to place bet');
    }
    return res.json();
  },

  getBets: async (params: {
    limit?: number;
    cursor?: string | null;
    rows?: number;
  }): Promise<BetListResponseDto> => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.cursor) searchParams.set('cursor', params.cursor);
    if (params.rows) searchParams.set('rows', params.rows.toString());

    const res = await fetch(`/api/bets?${searchParams.toString()}`);
    if (!res.ok) throw new BffError(res.status, 'Failed to fetch bets');
    return res.json();
  },

  logout: async (): Promise<void> => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (!res.ok) throw new BffError(res.status, 'Logout failed');
  },
};
