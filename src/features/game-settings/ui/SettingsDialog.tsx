'use client';

import React from 'react';
import { Volume2, X, Zap } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  Switch,
} from '@/shared/ui';
import { useSettings } from '@/entities';

const ICON_SIZE = 20;

const METADATA = {
  VERSION: '1.0.0',
  MODE: 'Demo (Mock API)',
} as const;

const LABELS = {
  TITLE: 'Settings',
  DESCRIPTION: 'Customize your gaming experience',
  SOUND_TITLE: 'Sound Effects',
  SOUND_DESC: 'Play sound effects during gameplay',
  ANIM_TITLE: 'Animations',
  ANIM_DESC: 'Enable smooth ball animations',
  VERSION_PREFIX: 'Version: ',
  MODE_PREFIX: 'Mode: ',
} as const;

interface Props {
  trigger: React.ReactElement;
}

export const SettingsDialog = ({ trigger }: Props) => {
  const { soundEffectsEnabled, animationsEnabled, setSoundEffectsEnabled, setAnimationsEnabled } =
    useSettings();

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogPopup className="bg-auth-card-bg border border-auth-border border-t-auth-border-top text-white rounded-[16px] w-full max-w-[448px] p-[33px] shadow-2xl focus:outline-none focus-visible:outline-none">
        <div className="flex justify-between items-start mb-[32px]">
          <div>
            <DialogTitle className="text-3xl font-bold text-white leading-none mb-2">
              {LABELS.TITLE}
            </DialogTitle>
            <DialogDescription className="text-base text-[#99A1AF]">
              {LABELS.DESCRIPTION}
            </DialogDescription>
          </div>
          <DialogClose
            render={
              <button className="text-white/40 hover:text-white/70 transition-colors p-1 cursor-pointer" />
            }
          >
            <X size={ICON_SIZE} />
          </DialogClose>
        </div>

        <div className="flex flex-col gap-6 mb-[32px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#00C950]/10 flex items-center justify-center text-[#00C950] shrink-0">
                <Volume2 size={ICON_SIZE} />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-white">{LABELS.SOUND_TITLE}</span>
                <span className="text-[12px] text-[#99A1AF]">{LABELS.SOUND_DESC}</span>
              </div>
            </div>
            <Switch checked={soundEffectsEnabled} onCheckedChange={setSoundEffectsEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#00C950]/10 flex items-center justify-center text-[#00C950] shrink-0">
                <Zap size={ICON_SIZE} />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-white">{LABELS.ANIM_TITLE}</span>
                <span className="text-[12px] text-[#99A1AF]">{LABELS.ANIM_DESC}</span>
              </div>
            </div>
            <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-auth-border pt-6 flex flex-col gap-1.5 text-[14px] text-[#99A1AF]">
          <div>
            {LABELS.VERSION_PREFIX}
            <span className="text-white">{METADATA.VERSION}</span>
          </div>
          <div>
            {LABELS.MODE_PREFIX}
            <span className="text-white">{METADATA.MODE}</span>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
};
