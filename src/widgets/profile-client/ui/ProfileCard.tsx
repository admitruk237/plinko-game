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
    <div className="flex flex-col gap-6 rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-[25px]">
      <div className="flex items-start gap-6">
        <ProfileAvatar
          avatarUrl={profile.avatarUrl}
          nickname={profile.nickname}
          isUploading={avatar.isUploading}
          onOpenModal={avatar.onOpenModal}
        />

        <div className="flex-1">
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
                  className="h-7 rounded-[4px] bg-[#00C950] px-3 text-sm font-medium text-white hover:opacity-90"
                >
                  Save
                </Button>
                <Button
                  size="none"
                  onClick={nickname.onCancel}
                  className="h-7 rounded-[4px] bg-[#2A2F3E] px-3 text-sm font-medium text-[#D1D5DC] hover:opacity-90"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-lg font-bold text-white">{profile.nickname}</h1>
                <button type="button" aria-label="Edit nickname" onClick={nickname.onEditStart}>
                  <Pencil className="h-4 w-4 text-[#99A1AF]" />
                </button>
              </>
            )}
          </div>
          {nickname.error ? <p className="mt-1 text-sm text-red-400">{nickname.error}</p> : null}

          <p className="mt-1 text-sm text-[#99A1AF]">{profile.email}</p>

          <div className="mt-2 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-white">
              <Trophy className="h-4 w-4 text-[#F0B100]" /> Level {profile.progression.level}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white">
              <Flame className="h-4 w-4 text-[#FF6900]" /> {profile.progression.dailyStreak} day
              streak
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-[#99A1AF]">Balance</p>
          <span className="flex items-center gap-1.5">
            <CurrencyIcon className="h-5 w-5" />
            <span className="text-xl font-bold text-[#00C950]">{balanceDisplay}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-white">
            <TrendingUp className="h-4 w-4 text-[#51A2FF]" /> Level {profile.progression.level}{' '}
            Progress
          </span>
          <span className="text-xs text-[#99A1AF]">
            {profile.progression.xpIntoCurrentLevel} / {profile.progression.xpForNextLevel} XP
          </span>
        </div>
        <ProgressBar percent={levelPercent} className="h-2" />
      </div>
    </div>

    <AvatarUploadDialog
      isOpen={avatar.isModalOpen}
      pendingFile={avatar.pendingFile}
      isUploading={avatar.isUploading}
      onClose={avatar.onCloseModal}
      onFileSelect={avatar.onFileSelect}
      onUpload={avatar.onUpload}
    />
  </>
);
