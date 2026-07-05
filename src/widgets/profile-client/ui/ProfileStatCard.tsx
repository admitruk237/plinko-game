interface Props {
  label: string;
  value: string;
}

export const ProfileStatCard = ({ label, value }: Props) => (
  <div className="flex-1 rounded-[10px] border border-panel-border bg-panel p-3 sm:p-[17px]">
    <p className="text-[10px] sm:text-xs text-text-muted">{label}</p>
    <p className="mt-1 text-lg sm:text-xl md:text-2xl font-bold text-white">{value}</p>
  </div>
);
