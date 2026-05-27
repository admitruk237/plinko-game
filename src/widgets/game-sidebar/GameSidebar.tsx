'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X as XIcon } from 'lucide-react';
import type { GameConfig, Risk } from '@/entities/game';
import { Button } from '@/shared/ui/button';
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
  onPlaceBet: (amount: string, rows: number, risk: Risk) => Promise<void> | void;
  showCloseButton?: boolean;
  onClose?: () => void;
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
  showCloseButton = false,
  onClose,
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
      className="md:h-full md:w-[320px] md:min-w-[320px] md:!overflow-y-auto md:[scrollbar-width:thin] md:[scrollbar-color:var(--color-panel-border)_transparent] md:[&::-webkit-scrollbar]:w-1 md:[&::-webkit-scrollbar-track]:bg-transparent md:[&::-webkit-scrollbar-thumb]:bg-panel-border md:[&::-webkit-scrollbar-thumb]:rounded-full max-md:w-full max-md:min-w-0 max-md:min-h-full max-md:border-none max-md:bg-transparent max-md:p-0 max-md:shadow-none z-10 shrink-0"
    >
      <Form {...form}>
        <form
          id="sidebar-form"
          onSubmit={form.handleSubmit(handleBet)}
          className="flex flex-col gap-4 min-h-full shrink-0"
        >
          <div className="flex items-center gap-3 w-full shrink-0">
            <div className="flex-grow">
              <BetModeToggle value={mode} onChange={setMode} disabled={isAutoBetting} />
            </div>
            {showCloseButton && (
              <Button
                type="button"
                onClick={onClose}
                variant="icon"
                size="none"
                className="md:hidden p-2 text-white/40 hover:text-white bg-panel-dark rounded-[14px] w-[36px] h-[36px] flex items-center justify-center shrink-0 border border-panel-border"
              >
                <XIcon size={16} />
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="betInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LABELS.BET_AMOUNT}</FormLabel>
                  <div className="relative flex items-center w-full">
                    <CurrencyIcon className="absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        disabled={isAutoBetting}
                        className="pl-8 pr-3 bg-sidebar-bg border border-white/10 focus-visible:border-green-500/50 focus-visible:border-t-green-500/50"
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

          <div className="mt-auto">
            <SidebarFooter onFullscreenToggle={handleFullscreenToggle} />
          </div>
        </form>
      </Form>
    </Card>
  );
};
