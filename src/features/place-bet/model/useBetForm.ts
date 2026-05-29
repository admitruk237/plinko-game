import { type ChangeEvent, useCallback, useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { formatCredits, MAX_BET, MIN_BET, parseCredits } from '@/shared/lib/credits';

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

  useEffect(() => {
    setBetAmount(betInput);
  }, [betInput, setBetAmount]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let clean = e.target.value.replace(/[^0-9.]/g, '');
      const dots = clean.split('.');
      if (dots.length > 2) {
        clean = `${dots[0]}.${dots.slice(1).join('')}`;
      }

      if (clean) {
        try {
          const parsed = parseCredits(clean);
          const maxAllowed = balanceBigInt < MAX_BET ? balanceBigInt : MAX_BET;
          if (parsed > maxAllowed) {
            form.setValue(BET_FIELD, formatCredits(maxAllowed.toString()));
            return;
          }
        } catch {}
      }
      form.setValue(BET_FIELD, clean);
    },
    [balanceBigInt, form]
  );

  const handleHalf = useCallback(() => {
    if (disabled) return;
    const current = parseCredits(betInput);
    const halved = current / 2n;
    const clamped = halved < MIN_BET ? MIN_BET : halved;
    form.setValue(BET_FIELD, formatCredits(clamped.toString()));
  }, [betInput, form, disabled]);

  const handleDouble = useCallback(() => {
    if (disabled) return;
    const current = parseCredits(betInput);
    const doubled = current * 2n;
    const maxAllowed = balanceBigInt < MAX_BET ? balanceBigInt : MAX_BET;
    const clamped = doubled > maxAllowed ? maxAllowed : doubled;
    form.setValue(BET_FIELD, formatCredits(clamped.toString()));
  }, [betInput, balanceBigInt, form, disabled]);

  const handleMax = useCallback(() => {
    if (disabled) return;
    const maxAllowed = balanceBigInt < MAX_BET ? balanceBigInt : MAX_BET;
    const clamped = maxAllowed < MIN_BET ? MIN_BET : maxAllowed;
    form.setValue(BET_FIELD, formatCredits(clamped.toString()));
  }, [balanceBigInt, form, disabled]);

  return {
    form,
    betInput,
    handleHalf,
    handleDouble,
    handleMax,
    handleInputChange,
  };
};
