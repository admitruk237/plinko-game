interface Props {
  label: string;
  value: string;
}

export const ProfileStatCard = ({ label, value }: Props) => (
  <div className="flex-1 rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-[17px]">
    <p className="text-xs text-[#99A1AF]">{label}</p>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
  </div>
);
