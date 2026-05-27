import { cn } from '@/shared/lib/utils';

interface Props {
  percent: number;
  className?: string;
  fillClassName?: string;
}

const FULL = 100;

export const ProgressBar = ({ percent, className, fillClassName }: Props) => {
  const width = Math.min(FULL, Math.max(0, percent));
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-panel-dark', className)}>
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500',
          fillClassName
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};
