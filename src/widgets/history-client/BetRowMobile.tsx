import { type ReactNode } from 'react';
import { flexRender, type Row } from '@tanstack/react-table';

import type { BetResponse } from '@/entities/game';
import { cn } from '@/shared/lib/utils';
import { TableCell } from '@/shared/ui';

interface Props {
  row: Row<BetResponse>;
}

export const BetRowMobile = ({ row }: Props) => {
  const cells = row.getVisibleCells();

  return (
    <div className="sm:hidden w-full">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {cells.slice(0, 4).map((cell) => (
          <TableCell
            key={cell.id}
            as="div"
            className="flex flex-col gap-1 p-0 border-none items-start"
          >
            <span className="text-xs text-balance-label font-sans">
              {cell.column.columnDef.header as ReactNode}
            </span>
            <div className="text-sm font-medium text-white/90">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </TableCell>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-x-2 mt-2 pt-2 border-t border-white/5">
        {cells.slice(4).map((cell, idx) => (
          <TableCell
            key={cell.id}
            as="div"
            className={cn(
              'flex flex-col gap-0.5 p-0 border-none',
              idx === 2 ? 'items-end text-right' : 'items-start'
            )}
          >
            <span className="text-[10px] text-balance-label font-sans">
              {cell.column.columnDef.header as ReactNode}
            </span>
            <div className="text-sm font-medium text-white/90">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </TableCell>
        ))}
      </div>
    </div>
  );
};
