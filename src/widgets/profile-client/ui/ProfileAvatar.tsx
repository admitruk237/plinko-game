'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Button, CameraIcon, type CameraIconHandle } from '@/shared/ui';

interface Props {
  avatarUrl: string;
  nickname: string;
  isUploading: boolean;
  onOpenModal: () => void;
}

export const ProfileAvatar = ({ avatarUrl, nickname, isUploading, onOpenModal }: Props) => {
  const cameraIconRef = useRef<CameraIconHandle>(null);

  return (
    <div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0">
      <div
        className={cn(
          'relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-full',
          'bg-gradient-to-br from-success to-success-end'
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
      <Button
        type="button"
        size="none"
        onClick={onOpenModal}
        disabled={isUploading}
        onMouseEnter={() => cameraIconRef.current?.startAnimation()}
        onMouseLeave={() => cameraIconRef.current?.stopAnimation()}
        aria-label="Change avatar"
        className="absolute bottom-0 right-0 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-success disabled:opacity-50"
      >
        <CameraIcon
          ref={cameraIconRef}
          className="[&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3 text-white"
        />
      </Button>
    </div>
  );
};
