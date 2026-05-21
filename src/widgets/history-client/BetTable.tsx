import type { BetResponse } from '@/entities/game';
import { formatCredits } from '@/shared/lib/credits';
import { multiplierTextColor } from '@/shared/lib/multiplier-color';
import { formatFullTimestamp, formatTimestamp } from '@/shared/lib/format-date';
import { RISK_BADGE_STYLES } from '@/shared/lib/risk-styles';

interface Props {
  bets: BetResponse[];
  onSelectBet: (bet: BetResponse) => void;
}

export const BetTable = ({ bets, onSelectBet }: Props) => {
  return (
    <table className="w-full mt-2">
      <thead>
        <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
          <th className="text-left py-3 font-medium">Time</th>
          <th className="text-left py-3 font-medium">Risk</th>
          <th className="text-center py-3 font-medium">Rows</th>
          <th className="text-right py-3 font-medium">Bet</th>
          <th className="text-right py-3 font-medium">Multiplier</th>
          <th className="text-right py-3 font-medium">Payout</th>
        </tr>
      </thead>
      <tbody>
        {bets.map((bet) => {
          const multiplier = Number(bet.multiplier);
          const isWin = multiplier >= 1;
          const colorClass = multiplierTextColor(multiplier);

          return (
            <tr
              key={bet.betId}
              onClick={() => onSelectBet(bet)}
              className={`border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                isWin ? 'bg-green-500/3' : 'bg-red-500/3'
              }`}
            >
              <td
                className="py-3 text-sm text-white/70"
                title={bet.createdAt ? formatFullTimestamp(bet.createdAt) : ''}
              >
                {bet.createdAt ? formatTimestamp(bet.createdAt) : '-'}
              </td>
              <td className="py-3">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border ${RISK_BADGE_STYLES[bet.risk]}`}
                >
                  {bet.risk}
                </span>
              </td>
              <td className="py-3 text-sm text-white/70 text-center">{bet.rows}</td>
              <td className="py-3 text-sm text-white/70 text-right font-mono">
                {formatCredits(bet.amount)}
              </td>
              <td className={`py-3 text-sm text-right font-bold ${colorClass}`}>{multiplier}x</td>
              <td
                className={`py-3 text-sm text-right font-mono ${isWin ? 'text-green-400' : 'text-red-400'}`}
              >
                {formatCredits(bet.payout)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
