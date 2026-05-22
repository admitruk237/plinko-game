import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

import type { BetResponse } from '@/entities/game';
import { formatCredits } from '@/shared/lib/credits';
import { formatFullTimestamp } from '@/shared/lib/format-date';
import { Badge, CurrencyIcon } from '@/shared/ui';

import {
  BALANCE_CELL_CLASS,
  CELL_TEXT_CLASS,
  COLUMN_HEADERS,
  MULTIPLIER_CELL_CLASS,
  MULTIPLIER_SUFFIX,
  PROFIT_NEG_CLASS,
  PROFIT_POS_CLASS,
  PROFIT_ZERO_CLASS,
  ROWS_SUFFIX,
  SIGN_MINUS,
  SIGN_PLUS,
  TIME_CELL_CLASS,
  ZERO_VALUE_FALLBACK,
} from './constants';

export const useBetColumns = (): ColumnDef<BetResponse>[] => {
  return useMemo<ColumnDef<BetResponse>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: COLUMN_HEADERS.TIME,
        cell: (ctx) => {
          const val = ctx.getValue<string | undefined>();
          return (
            <span className={TIME_CELL_CLASS}>
              {val ? formatFullTimestamp(val) : ZERO_VALUE_FALLBACK}
            </span>
          );
        },
      },
      {
        accessorKey: 'risk',
        header: COLUMN_HEADERS.SETTINGS,
        cell: (ctx) => {
          const risk = ctx.row.original.risk;
          const rows = ctx.row.original.rows;
          return (
            <div className="flex items-center gap-1.5">
              <span className={CELL_TEXT_CLASS}>
                {rows} {ROWS_SUFFIX}
              </span>
              <Badge variant={risk.toLowerCase() as 'low' | 'medium' | 'high'}>{risk}</Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'multiplier',
        header: COLUMN_HEADERS.MULTIPLIER,
        cell: (ctx) => {
          const multiplier = Number(ctx.getValue<string>());
          return (
            <span className={MULTIPLIER_CELL_CLASS}>
              {multiplier}
              {MULTIPLIER_SUFFIX}
            </span>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: COLUMN_HEADERS.BET_AMOUNT,
        cell: (ctx) => {
          const amount = ctx.getValue<string>();
          return (
            <div className="flex items-center gap-1.5">
              <CurrencyIcon />
              <span className={CELL_TEXT_CLASS}>{formatCredits(amount)}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'payout',
        header: COLUMN_HEADERS.PAYOUT,
        cell: (ctx) => {
          const payout = ctx.getValue<string>();
          return (
            <div className="flex items-center gap-1.5">
              <CurrencyIcon />
              <span className={CELL_TEXT_CLASS}>{formatCredits(payout)}</span>
            </div>
          );
        },
      },
      {
        id: 'profit',
        header: COLUMN_HEADERS.PROFIT,
        cell: (ctx) => {
          const payoutVal = BigInt(ctx.row.original.payout);
          const amountVal = BigInt(ctx.row.original.amount);
          const profitVal = payoutVal - amountVal;
          const isNegative = profitVal < 0n;
          const absProfit = isNegative ? -profitVal : profitVal;
          const formatted = formatCredits(absProfit.toString());

          if (isNegative) {
            return (
              <span className={PROFIT_NEG_CLASS}>
                {SIGN_MINUS}
                {formatted}
              </span>
            );
          }
          if (profitVal > 0n) {
            return (
              <span className={PROFIT_POS_CLASS}>
                {SIGN_PLUS}
                {formatted}
              </span>
            );
          }
          return <span className={PROFIT_ZERO_CLASS}>{formatted}</span>;
        },
      },
      {
        accessorKey: 'balanceAfter',
        header: COLUMN_HEADERS.BALANCE_AFTER,
        cell: (ctx) => {
          const balance = ctx.getValue<string>();
          return (
            <div className="flex items-center justify-end gap-1.5 w-full">
              <CurrencyIcon />
              <span className={BALANCE_CELL_CLASS}>{formatCredits(balance)}</span>
            </div>
          );
        },
      },
    ],
    []
  );
};
