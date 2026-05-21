import type { BetResponse } from '@/entities/game';
import { formatCredits } from '@/shared/lib/credits';
import { multiplierTextColor } from '@/shared/lib/multiplier-color';
import { RISK_BADGE_STYLES } from '@/shared/lib/risk-styles';

interface Props {
  bet: BetResponse;
  onClose: () => void;
}

export const BetDetailDrawer = ({ bet, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[#1a1e2e] border-t border-white/10 rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-4">Bet Details</h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-white/50">Bet ID</div>
          <div className="text-white font-mono text-xs truncate">{bet.betId}</div>

          <div className="text-white/50">Path</div>
          <div className="text-white font-mono tracking-wider">{bet.path}</div>

          <div className="text-white/50">Bucket</div>
          <div className="text-white">{bet.bucketIndex}</div>

          <div className="text-white/50">Risk</div>
          <div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${RISK_BADGE_STYLES[bet.risk]}`}
            >
              {bet.risk}
            </span>
          </div>

          <div className="text-white/50">Rows</div>
          <div className="text-white">{bet.rows}</div>

          <div className="text-white/50">Amount</div>
          <div className="text-white font-mono">{formatCredits(bet.amount)}</div>

          <div className="text-white/50">Multiplier</div>
          <div className={`font-bold ${multiplierTextColor(Number(bet.multiplier))}`}>
            {bet.multiplier}x
          </div>

          <div className="text-white/50">Payout</div>
          <div className="text-white font-mono">{formatCredits(bet.payout)}</div>

          {bet.seed && (
            <>
              <div className="text-white/50">Server Seed Hash</div>
              <div className="text-white font-mono text-xs truncate">{bet.seed.serverSeedHash}</div>

              <div className="text-white/50">Client Seed</div>
              <div className="text-white font-mono text-xs truncate">{bet.seed.clientSeed}</div>

              <div className="text-white/50">Nonce</div>
              <div className="text-white">{bet.seed.nonce}</div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full h-9 bg-[#2a2f3e] rounded-lg text-sm text-white/70 font-medium hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
