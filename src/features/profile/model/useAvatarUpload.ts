import { useCallback, useRef } from 'react';
import { useUploadAvatar } from '@/features/profile/api';

interface AvatarUpload {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  onPickAvatar: () => void;
  onAvatarSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useAvatarUpload = (): AvatarUpload => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending } = useUploadAvatar();

  const onPickAvatar = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onAvatarSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) mutate(file);
      event.target.value = '';
    },
    [mutate]
  );

  return { fileInputRef, isUploading: isPending, onPickAvatar, onAvatarSelect };
};
