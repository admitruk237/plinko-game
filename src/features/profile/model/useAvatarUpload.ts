import { useCallback, useState } from 'react';
import { useUploadAvatar } from '@/features/profile/api';

interface AvatarUpload {
  isModalOpen: boolean;
  pendingFile: File | null;
  isUploading: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
}

export const useAvatarUpload = (): AvatarUpload => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { mutate, isPending } = useUploadAvatar();

  const onOpenModal = useCallback(() => setIsModalOpen(true), []);

  const onCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingFile(null);
  }, []);

  const onFileSelect = useCallback((file: File) => {
    setPendingFile(file);
  }, []);

  const onUpload = useCallback(() => {
    if (!pendingFile) return;
    mutate(pendingFile, { onSuccess: onCloseModal });
  }, [pendingFile, mutate, onCloseModal]);

  return {
    isModalOpen,
    pendingFile,
    isUploading: isPending,
    onOpenModal,
    onCloseModal,
    onFileSelect,
    onUpload,
  };
};
