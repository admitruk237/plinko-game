'use client';
import { AnimatePresence, motion } from 'motion/react';
import type { GameConfig, Risk } from '@/entities/game';
import { Card } from '@/shared/ui/card';
import { BetModeToggle } from '@/features/bet-mode';
import { CurrencyIcon } from '@/shared/ui/currency-icon';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { QuickBetControls } from '@/features/place-bet';
import { BET_MODES } from '@/shared/config';
import { useGameSidebar } from './model/useGameSidebar';
import { RiskSelector } from './ui/RiskSelector';
import { RowsSelector } from './ui/RowsSelector';
import { AutoBetSettings } from './ui/AutoBetSettings';
import { SidebarFooter } from './ui/SidebarFooter';
import { BetButton } from './ui/BetButton';
import { LABELS, ZERO } from './model/constants';

interface Props {
  config: GameConfig;
  balance: string;
  isPlaying: boolean;
  rows: number;
  risk: Risk;
  onRowsChange: (rows: number) => void;
  onRiskChange: (risk: Risk) => void;
  onPlaceBet: (amount: string, rows: number, risk: Risk) => void;
}

export const GameSidebar = ({
  config,
  balance,
  isPlaying,
  rows,
  risk,
  onRowsChange,
  onRiskChange,
  onPlaceBet,
}: Props) => {
  const {
    mode,
    setMode,
    handleRowsChange,
    handleFullscreenToggle,
    form,
    handleHalf,
    handleDouble,
    handleMax,
    handleInputChange,
    numBetsInput,
    stopProfitInput,
    stopLossInput,
    isAutoBetting,
    currentBetCount,
    handleBet,
    handleNumBetsChange,
    handleStopProfitChange,
    handleStopLossChange,
  } = useGameSidebar({ config, balance, isPlaying, rows, risk, onRowsChange, onPlaceBet });

  const isAutoDisabled = isAutoBetting ? false : isPlaying;
  const isBetButtonDisabled = mode === BET_MODES.AUTO ? isAutoDisabled : false;

  const limitNumBets = parseInt(numBetsInput, 10);

  return (
    <Card
      variant="sidebar"
      className="h-full max-md:w-full max-md:min-w-0 max-md:h-auto z-10 shrink-0"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleBet)} className="flex flex-col gap-4 h-full">
          <BetModeToggle value={mode} onChange={setMode} disabled={isAutoBetting} />
          <div className="flex flex-col gap-2 shrink-0">
            <FormField
              control={form.control}
              name="betInput"
              render={({ field }) => (
                <FormItem className="shrink-0">
                  <FormLabel>{LABELS.BET_AMOUNT}</FormLabel>
                  <div className="relative flex items-center w-full">
                    <CurrencyIcon className="absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        disabled={isAutoBetting}
                        className="pl-8 pr-3 bg-[#0f1219] border border-white/10 focus-visible:border-green-500/50 focus-visible:border-t-green-500/50"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <QuickBetControls
              onHalf={handleHalf}
              onDouble={handleDouble}
              onMax={handleMax}
              disabled={isAutoBetting}
            />
          </div>
          <RiskSelector
            risks={config.risks}
            currentRisk={risk}
            onChange={onRiskChange}
            disabled={isPlaying || isAutoBetting}
          />
          <RowsSelector
            rows={rows}
            min={config.rows[ZERO]}
            max={config.rows[config.rows.length - 1]}
            onChange={handleRowsChange}
            disabled={isPlaying || isAutoBetting}
          />

          <AnimatePresence initial={false}>
            {mode === BET_MODES.AUTO && (
              <motion.div
                key="auto-bet-settings"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex flex-col gap-4 overflow-hidden"
              >
                <AutoBetSettings
                  numBetsInput={numBetsInput}
                  stopProfitInput={stopProfitInput}
                  stopLossInput={stopLossInput}
                  isAutoBetting={isAutoBetting}
                  onNumBetsChange={handleNumBetsChange}
                  onStopProfitChange={handleStopProfitChange}
                  onStopLossChange={handleStopLossChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <BetButton
            mode={mode}
            isAutoBetting={isAutoBetting}
            disabled={isBetButtonDisabled}
            limitNumBets={limitNumBets}
            currentBetCount={currentBetCount}
          />
          <SidebarFooter onFullscreenToggle={handleFullscreenToggle} />
        </form>
      </Form>
    </Card>
  );
};
