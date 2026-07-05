import { type ChangeEvent, type DragEvent, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  UploadIcon,
  type UploadIconHandle,
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
  const uploadIconRef = useRef<UploadIconHandle | null>(null);

  const handleDropZoneClick = () => fileInputRef.current?.click();

  const handleDragOver = (e: DragEvent) => e.preventDefault();

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      <DialogPopup className="w-full max-w-[512px] rounded-[10px] border border-panel-border bg-panel p-[25px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              Upload Avatar
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-text-muted">
              Choose a profile picture (max 5MB)
            </DialogDescription>
          </div>
          <DialogClose render={<Button variant="icon" size="none" aria-label="Close dialog" />}>
            <X size={16} />
          </DialogClose>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="ghost"
            size="none"
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseEnter={() => uploadIconRef.current?.startAnimation()}
            onMouseLeave={() => uploadIconRef.current?.stopAnimation()}
            className={cn(
              'flex h-[168px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-panel-border transition-colors hover:border-border-hover hover:bg-transparent'
            )}
          >
            <UploadIcon ref={uploadIconRef} size={48} className="text-text-muted" />
            {pendingFile ? (
              <p className="text-sm font-medium text-success">{pendingFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-neutral-300">Drop an image here or click to browse</p>
                <p className="text-xs text-text-tertiary">PNG, JPG up to 5MB</p>
              </>
            )}
          </Button>

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
              className="h-[44px] flex-1 rounded-[10px] bg-panel-border text-base font-medium text-neutral-300 hover:opacity-90"
            >
              Cancel
            </Button>
            <Button
              size="none"
              onClick={onUpload}
              disabled={!pendingFile || isUploading}
              className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-success to-success-end text-base font-medium text-white disabled:opacity-50"
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
