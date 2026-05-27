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
              className="block w-full bg-balance-bg border border-balance-border border-t-panel-border rounded-[10px] p-3 sm:p-4 lg:py-3.5 lg:px-5 opacity-100 hover:bg-transparent"
            >
              {/* Mobile layout */}
              <div className="sm:hidden w-full">
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  {row
                    .getVisibleCells()
                    .slice(0, 4)
                    .map((cell) => (
                      <TableCell
                        key={cell.id}
                        as="div"
                        className="flex flex-col gap-1 p-0 border-none items-start"
                      >
                        <span className="text-xs text-balance-label font-sans">
                          {cell.column.columnDef.header as React.ReactNode}
                        </span>
                        <div className="text-sm font-medium text-white/90">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-x-2 mt-2 pt-2 border-t border-white/5">
                  {row
                    .getVisibleCells()
                    .slice(4)
                    .map((cell, idx) => {
                      const isLast = idx === 2;
                      return (
                        <TableCell
                          key={cell.id}
                          as="div"
                          className={cn(
                            'flex flex-col gap-0.5 p-0 border-none',
                            isLast ? 'items-end text-right' : 'items-start'
                          )}
                        >
                          <span className="text-[10px] text-balance-label font-sans">
                            {cell.column.columnDef.header as React.ReactNode}
                          </span>
                          <div className="text-sm font-medium text-white/90">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      );
                    })}
                </div>
              </div>

              {/* Tablet / Desktop layout */}
              <div className="hidden sm:grid sm:grid-cols-4 lg:flex lg:flex-row lg:items-center lg:gap-10 w-full gap-4">
                {row.getVisibleCells().map((cell, idx) => {
                  const isLast = idx === row.getVisibleCells().length - 1;
                  return (
                    <TableCell
                      key={cell.id}
                      as="div"
                      className={cn(
                        'flex flex-col gap-1 p-0 align-baseline border-none shrink-0',
                        isLast ? 'items-end text-right lg:ml-auto' : 'items-start text-left'
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
