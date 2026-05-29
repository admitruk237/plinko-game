import { type ChangeEvent, useCallback } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import {
  formatCredits,
  MAX_BET,
  MIN_BET,
  parseCredits,
  sanitizeDecimalInput,
} from '@/shared/lib/credits';

import { DEFAULT_BET_AMOUNT } from '@/shared/config';
import { usePlaceBetStore } from './store';

interface Props {
  balance: string;
  disabled?: boolean;
}

const BET_FIELD = 'betInput' as const;

interface BetFormValues {
  betInput: string;
}

interface UseBetFormResult {
  form: UseFormReturn<BetFormValues>;
  betInput: string;
  handleHalf: () => void;
  handleDouble: () => void;
  handleMax: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useBetForm = ({ balance, disabled }: Props): UseBetFormResult => {
  const balanceBigInt = BigInt(balance || '0');
  const setBetAmount = usePlaceBetStore((state) => state.setBetAmount);

  const form = useForm<BetFormValues>({
    defaultValues: {
      betInput: DEFAULT_BET_AMOUNT,
    },
  });

  const betInput = form.watch(BET_FIELD);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const clean = sanitizeDecimalInput(e.target.value);

      if (clean) {
        try {
          const parsed = parseCredits(clean);
          const maxAllowed = balanceBigInt < MAX_BET ? balanceBigInt : MAX_BET;
          if (parsed > maxAllowed) {
            const clamped = formatCredits(maxAllowed.toString());
            form.setValue(BET_FIELD, clamped);
            setBetAmount(clamped);
            return;
          }
        } catch {}
      }
      form.setValue(BET_FIELD, clean);
      setBetAmount(clean);
    },
    [balanceBigInt, form, setBetAmount]
  );

  const handleHalf = useCallback(() => {
    if (disabled) return;
    const current = parseCredits(betInput);
    const halved = current / 2n;
    const clamped = halved < MIN_BET ? MIN_BET : halved;
    const formatted = formatCredits(clamped.toString());
    form.setValue(BET_FIELD, formatted);
    setBetAmount(formatted);
  }, [betInput, form, disabled, setBetAmount]);

  const handleDouble = useCallback(() => {
    if (disabled) return;
    const current = parseCredits(betInput);
    const doubled = current * 2n;
    const maxAllowed = balanceBigInt < MAX_BET ? balanceBigInt : MAX_BET;
    const clamped = doubled > maxAllowed ? maxAllowed : doubled;
    const formatted = formatCredits(clamped.toString());
    form.setValue(BET_FIELD, formatted);
    setBetAmount(formatted);
  }, [betInput, balanceBigInt, form, disabled, setBetAmount]);

  const handleMax = useCallback(() => {
    if (disabled) return;
    const maxAllowed = balanceBigInt < MAX_BET ? balanceBigInt : MAX_BET;
    const clamped = maxAllowed < MIN_BET ? MIN_BET : maxAllowed;
    const formatted = formatCredits(clamped.toString());
    form.setValue(BET_FIELD, formatted);
    setBetAmount(formatted);
  }, [balanceBigInt, form, disabled, setBetAmount]);

  return {
    form,
    betInput,
    handleHalf,
    handleDouble,
    handleMax,
    handleInputChange,
  };
};
