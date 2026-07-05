import { Flame, Pencil, TrendingUp, Trophy } from 'lucide-react';
import { Button, CurrencyIcon, Input, ProgressBar } from '@/shared/ui';
import type { ProfileDto } from '@/shared/api/types';
import type { useAvatarUpload, useNicknameEdit } from '@/features/profile';
import { ProfileAvatar } from './ProfileAvatar';
import { AvatarUploadDialog } from './AvatarUploadDialog';

interface Props {
  profile: ProfileDto;
  balanceDisplay: string;
  levelPercent: number;
  nickname: ReturnType<typeof useNicknameEdit>;
  avatar: ReturnType<typeof useAvatarUpload>;
}

export const ProfileCard = ({ profile, balanceDisplay, levelPercent, nickname, avatar }: Props) => (
  <>
    <div className="flex flex-col gap-4 sm:gap-6 rounded-[10px] border border-panel-border bg-panel p-4 sm:p-[25px]">
      <div className="flex items-start gap-4 sm:gap-6">
        <ProfileAvatar
          avatarUrl={profile.avatarUrl}
          nickname={profile.nickname}
          isUploading={avatar.isUploading}
          onOpenModal={avatar.onOpenModal}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {nickname.isEditing ? (
              <>
                <Input
                  value={nickname.value}
                  onChange={(e) => nickname.onChange(e.target.value)}
                  className="h-[38px] max-w-[243px]"
                />
                <Button
                  size="none"
                  onClick={nickname.onSave}
                  disabled={nickname.isPending}
                  className="h-7 rounded-[4px] bg-success px-3 text-xs sm:text-sm font-medium text-white hover:opacity-90"
                >
                  Save
                </Button>
                <Button
                  size="none"
                  onClick={nickname.onCancel}
                  className="h-7 rounded-[4px] bg-panel-border px-3 text-xs sm:text-sm font-medium text-neutral-300 hover:opacity-90"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-base sm:text-lg font-bold text-white truncate">
                  {profile.nickname}
                </h1>
                <Button
                  variant="icon"
                  size="icon-xs"
                  type="button"
                  aria-label="Edit nickname"
                  onClick={nickname.onEditStart}
                >
                  <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-text-muted" />
                </Button>
              </>
            )}
          </div>
          {nickname.error ? (
            <p className="mt-1 text-xs sm:text-sm text-red-400">{nickname.error}</p>
          ) : null}

          <p className="mt-1 text-xs sm:text-sm text-text-muted truncate">{profile.email}</p>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-white">
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" /> Level{' '}
              {profile.progression.level}
            </span>
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-white">
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />{' '}
              {profile.progression.dailyStreak} day streak
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <p className="text-[10px] sm:text-xs text-text-muted">Balance</p>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <CurrencyIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm md:text-base font-bold text-success">
              {balanceDisplay}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" /> Level{' '}
            {profile.progression.level} Progress
          </span>
          <span className="text-[10px] sm:text-xs text-text-muted">
            {profile.progression.xpIntoCurrentLevel} / {profile.progression.xpForNextLevel} XP
          </span>
        </div>
        <ProgressBar percent={levelPercent} className="h-1.5 sm:h-2" />
      </div>
    </div>

    <AvatarUploadDialog
      isOpen={avatar.isModalOpen}
      pendingFile={avatar.pendingFile}
      isUploading={avatar.isUploading}
      uploadError={avatar.uploadError}
      onClose={avatar.onCloseModal}
      onFileSelect={avatar.onFileSelect}
      onUpload={avatar.onUpload}
    />
  </>
);
