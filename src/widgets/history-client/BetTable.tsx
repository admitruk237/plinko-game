import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { BetResponse } from '@/entities/game';
import { Table, TableBody, TableRow } from '@/shared/ui';

import { BetRowDesktop } from './BetRowDesktop';
import { BetRowMobile } from './BetRowMobile';
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
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            as="div"
            className="block w-full bg-balance-bg border border-balance-border border-t-panel-border rounded-[10px] p-3 sm:p-4 lg:py-3.5 lg:px-5 opacity-100 hover:bg-transparent"
          >
            <BetRowMobile row={row} />
            <BetRowDesktop row={row} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
