import { Camera } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface Props {
  avatarUrl: string;
  nickname: string;
  isUploading: boolean;
  onOpenModal: () => void;
}

export const ProfileAvatar = ({ avatarUrl, nickname, isUploading, onOpenModal }: Props) => (
  <div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0">
    <div
      className={cn(
        'relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-full',
        'bg-gradient-to-br from-[#00C950] to-[#009966]'
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={nickname}
          fill
          sizes="(max-width: 640px) 48px, 64px"
          className="rounded-full object-cover"
        />
      ) : (
        <span className="text-lg sm:text-xl font-bold text-white">
          {nickname.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
    <button
      type="button"
      onClick={onOpenModal}
      disabled={isUploading}
      aria-label="Change avatar"
      className="absolute bottom-0 right-0 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#00C950] disabled:opacity-50"
    >
      <Camera className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
    </button>
  </div>
);
