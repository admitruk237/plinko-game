'use client';

import { Filter } from 'lucide-react';
import {
  Select,
  SelectIcon,
  SelectItem,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { DEFAULT_FILTER_VALUE, RISK_OPTIONS, ROW_OPTIONS } from '../model/constants';

interface Props {
  filterRisk: string;
  filterRows: string;
  onRiskChange: (value: string) => void;
  onRowsChange: (value: string) => void;
}

export const HistoryFilters = ({ filterRisk, filterRows, onRiskChange, onRowsChange }: Props) => {
  return (
    <div className="mt-4 sm:mt-6 w-full bg-balance-bg border border-balance-border border-t-panel-border rounded-[10px] py-3 px-3 sm:pt-[17px] sm:pr-[17px] sm:pb-[1px] sm:pl-[17px] opacity-100">
      <div className="flex items-center flex-nowrap gap-2 sm:gap-6 sm:flex-wrap pb-1 sm:pb-4">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-white" />
          <span className="hidden sm:inline text-sm font-semibold text-white">Filters:</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-normal text-balance-label leading-4 tracking-normal font-sans">
            Risk:
          </span>
          <Select
            value={filterRisk}
            onValueChange={(val) => onRiskChange(val ?? DEFAULT_FILTER_VALUE)}
          >
            <SelectTrigger className="w-[90px] sm:w-[120px]">
              <SelectValue placeholder="All" />
              <SelectIcon />
            </SelectTrigger>
            <SelectPortal>
              <SelectPositioner side="bottom" align="start" sideOffset={4}>
                <SelectPopup>
                  {RISK_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </SelectPositioner>
            </SelectPortal>
          </Select>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-normal text-balance-label leading-4 tracking-normal font-sans">
            Rows:
          </span>
          <Select
            value={filterRows}
            onValueChange={(val) => onRowsChange(val ?? DEFAULT_FILTER_VALUE)}
          >
            <SelectTrigger className="w-[80px] sm:w-[100px]">
              <SelectValue placeholder="All" />
              <SelectIcon />
            </SelectTrigger>
            <SelectPortal>
              <SelectPositioner side="bottom" align="start" sideOffset={4}>
                <SelectPopup>
                  {ROW_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </SelectPositioner>
            </SelectPortal>
          </Select>
        </div>
      </div>
    </div>
  );
};
