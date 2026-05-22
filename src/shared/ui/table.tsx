import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const Table = ({ className, as: Component = 'table', ...props }: TableProps) => (
  <div className="relative w-full overflow-auto">
    <Component
      data-slot="table"
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
);
Table.displayName = 'Table';

export const TableHeader = ({ className, as: Component = 'thead', ...props }: TableProps) => (
  <Component data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

export const TableBody = ({ className, as: Component = 'tbody', ...props }: TableProps) => (
  <Component
    data-slot="table-body"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
);
TableBody.displayName = 'TableBody';

export const TableFooter = ({ className, as: Component = 'tfoot', ...props }: TableProps) => (
  <Component
    data-slot="table-footer"
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
);
TableFooter.displayName = 'TableFooter';

export const TableRow = ({ className, as: Component = 'tr', ...props }: TableProps) => (
  <Component
    data-slot="table-row"
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

export const TableHead = ({ className, as: Component = 'th', ...props }: TableProps) => (
  <Component
    data-slot="table-head"
    className={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
);
TableHead.displayName = 'TableHead';

export const TableCell = ({ className, as: Component = 'td', ...props }: TableProps) => (
  <Component
    data-slot="table-cell"
    className={cn(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
);
TableCell.displayName = 'TableCell';

export const TableCaption = ({ className, as: Component = 'caption', ...props }: TableProps) => (
  <Component
    data-slot="table-caption"
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
);
TableCaption.displayName = 'TableCaption';
