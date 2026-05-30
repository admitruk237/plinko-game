import { useCallback, useState } from 'react';
import { useUploadAvatar } from '../api';
import { BffError } from '@/shared/api';

interface AvatarUpload {
  isModalOpen: boolean;
  pendingFile: File | null;
  isUploading: boolean;
  uploadError: string | null;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
}

export const useAvatarUpload = (): AvatarUpload => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutate, isPending } = useUploadAvatar();

  const onOpenModal = useCallback(() => {
    setUploadError(null);
    setIsModalOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingFile(null);
    setUploadError(null);
  }, []);

  const onFileSelect = useCallback((file: File) => {
    setPendingFile(file);
    setUploadError(null);
  }, []);

  const onUpload = useCallback(() => {
    if (!pendingFile) return;
    setUploadError(null);
    mutate(pendingFile, {
      onSuccess: onCloseModal,
      onError: (err) => {
        const message = err instanceof BffError ? err.message : 'Upload failed. Please try again.';
        setUploadError(message);
      },
    });
  }, [pendingFile, mutate, onCloseModal]);

  return {
    isModalOpen,
    pendingFile,
    isUploading: isPending,
    uploadError,
    onOpenModal,
    onCloseModal,
    onFileSelect,
    onUpload,
  };
};
