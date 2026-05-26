import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

interface Props {
  isOpen: boolean;
  pendingFile: File | null;
  isUploading: boolean;
  uploadError: string | null;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
}

export const AvatarUploadDialog = ({
  isOpen,
  pendingFile,
  isUploading,
  uploadError,
  onClose,
  onFileSelect,
  onUpload,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDropZoneClick = () => fileInputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
    >
      <DialogPopup className="w-full max-w-[512px] rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-[25px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-xl font-bold text-white">Upload Avatar</DialogTitle>
            <DialogDescription className="text-sm text-[#99A1AF]">
              Choose a profile picture (max 5MB)
            </DialogDescription>
          </div>
          <DialogClose
            render={
              <button
                type="button"
                className="text-white/40 hover:text-white/70 transition-colors"
              />
            }
          >
            <X size={16} />
          </DialogClose>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              'flex h-[168px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#2A2F3E] transition-colors hover:border-[#3A3F4E]'
            )}
          >
            <Upload className="h-12 w-12 text-[#99A1AF]" />
            {pendingFile ? (
              <p className="text-sm font-medium text-[#00C950]">{pendingFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-[#D1D5DC]">Drop an image here or click to browse</p>
                <p className="text-xs text-[#6A7282]">PNG, JPG up to 5MB</p>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}

          <div className="flex gap-3">
            <Button
              size="none"
              onClick={onClose}
              className="h-[44px] flex-1 rounded-[10px] bg-[#2A2F3E] text-base font-medium text-[#D1D5DC] hover:opacity-90"
            >
              Cancel
            </Button>
            <Button
              size="none"
              onClick={onUpload}
              disabled={!pendingFile || isUploading}
              className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#00C950] to-[#009966] text-base font-medium text-white disabled:opacity-50"
            >
              <Upload size={16} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
};
