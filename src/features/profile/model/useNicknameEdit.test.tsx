import { type ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNicknameEdit } from './useNicknameEdit';
import { bffApi } from '@/shared/api';

jest.mock('@/shared/api', () => ({
  bffApi: { updateProfile: jest.fn() },
  BffError: class BffError extends Error {
    constructor(
      public status: number,
      message: string
    ) {
      super(message);
    }
  },
}));

const mockUpdate = bffApi.updateProfile as jest.Mock;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

beforeEach(() => {
  mockUpdate.mockReset();
});

it('starts not editing and seeds the input from the current nickname', () => {
  const { result } = renderHook(() => useNicknameEdit('Player8869'), { wrapper });
  expect(result.current.isEditing).toBe(false);
  act(() => result.current.onEditStart());
  expect(result.current.isEditing).toBe(true);
  expect(result.current.value).toBe('Player8869');
});

it('blocks save and surfaces a validation error for an invalid nickname', async () => {
  const { result } = renderHook(() => useNicknameEdit('Player8869'), { wrapper });
  act(() => result.current.onEditStart());
  act(() => result.current.onChange('ab'));
  await act(async () => {
    await result.current.onSave();
  });
  expect(mockUpdate).not.toHaveBeenCalled();
  expect(result.current.error).toMatch(/at least 3/i);
});

it('maps a 409 response to "Nickname already taken"', async () => {
  const { BffError } = jest.requireMock('@/shared/api');
  mockUpdate.mockRejectedValue(new BffError(409, 'conflict'));
  const { result } = renderHook(() => useNicknameEdit('Player8869'), { wrapper });
  act(() => result.current.onEditStart());
  act(() => result.current.onChange('TakenName'));
  await act(async () => {
    await result.current.onSave();
  });
  expect(result.current.error).toBe('Nickname already taken');
});
