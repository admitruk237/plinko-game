import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { BetResponse } from '@/entities/game';
import { cn } from '@/shared/lib/utils';
import { Table, TableBody, TableCell, TableRow } from '@/shared/ui';

import { useBetColumns } from './model/useBetColumns';

interface Props {
  bets: BetResponse[];
}

export const BetTable = ({ bets }: Props) => {
  const columns = useBetColumns();

  const table = useReactTable({
    data: bets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table as="div" className="block w-full border-none">
      <TableBody as="div" className="flex flex-col gap-3 w-full border-none">
        {table.getRowModel().rows.map((row) => {
          return (
            <TableRow
              key={row.id}
              as="div"
              className="block w-full bg-balance-bg border border-balance-border border-t-[#2A2F3E] rounded-[10px] p-3 sm:p-4 lg:py-3.5 lg:px-5 opacity-100 hover:bg-transparent"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row lg:items-center lg:gap-10 w-full gap-3 sm:gap-4">
                {row.getVisibleCells().map((cell, idx) => {
                  const isLast = idx === row.getVisibleCells().length - 1;
                  return (
                    <TableCell
                      key={cell.id}
                      as="div"
                      className={cn(
                        'flex flex-col gap-1 p-0 align-baseline border-none shrink-0',
                        isLast
                          ? 'col-span-2 sm:col-span-1 items-end text-right lg:ml-auto'
                          : 'items-start text-left'
                      )}
                    >
                      <span className="text-xs font-normal text-balance-label leading-4 tracking-normal font-sans">
                        {cell.column.columnDef.header as React.ReactNode}
                      </span>
                      <div className="text-sm font-medium text-white/90">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  );
                })}
              </div>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
