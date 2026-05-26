import { Camera } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Props {
  avatarUrl: string;
  nickname: string;
  isUploading: boolean;
  onOpenModal: () => void;
}

export const ProfileAvatar = ({ avatarUrl, nickname, isUploading, onOpenModal }: Props) => (
  <div className="relative h-20 w-20 shrink-0">
    <div
      className={cn(
        'flex h-20 w-20 items-center justify-center overflow-hidden rounded-full',
        'bg-gradient-to-br from-[#00C950] to-[#009966]'
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={nickname} className="h-20 w-20 rounded-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-white">{nickname.charAt(0).toUpperCase()}</span>
      )}
    </div>
    <button
      type="button"
      onClick={onOpenModal}
      disabled={isUploading}
      aria-label="Change avatar"
      className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#00C950] disabled:opacity-50"
    >
      <Camera className="h-4 w-4 text-white" />
    </button>
  </div>
);
