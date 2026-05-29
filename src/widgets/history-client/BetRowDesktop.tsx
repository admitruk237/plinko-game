import { type ReactNode } from 'react';
import { flexRender, type Row } from '@tanstack/react-table';

import type { BetResponse } from '@/entities/game';
import { cn } from '@/shared/lib/utils';
import { TableCell } from '@/shared/ui';

interface Props {
  row: Row<BetResponse>;
}

export const BetRowDesktop = ({ row }: Props) => {
  const cells = row.getVisibleCells();

  return (
    <div className="hidden sm:grid sm:grid-cols-4 lg:flex lg:flex-row lg:items-center lg:gap-10 w-full gap-4">
      {cells.map((cell, idx) => (
        <TableCell
          key={cell.id}
          as="div"
          className={cn(
            'flex flex-col gap-1 p-0 align-baseline border-none shrink-0',
            idx === cells.length - 1 ? 'items-end text-right lg:ml-auto' : 'items-start text-left'
          )}
        >
          <span className="text-xs font-normal text-balance-label leading-4 tracking-normal font-sans">
            {cell.column.columnDef.header as ReactNode}
          </span>
          <div className="text-sm font-medium text-white/90">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        </TableCell>
      ))}
    </div>
  );
};
