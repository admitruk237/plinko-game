import { Maximize2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { SettingsIcon } from '@/shared/ui/settings-icon';
import { SettingsDialog } from '@/features/game-settings';

const ICON_SIZE = 16;
const STROKE_WIDTH = 2;

interface Props {
  onFullscreenToggle: () => void;
}

export const SidebarFooter = ({ onFullscreenToggle }: Props) => {
  return (
    <div className="flex items-center justify-between gap-2 shrink-0">
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={onFullscreenToggle}
        className="transition-all duration-500 hover:scale-[1.1]"
      >
        <Maximize2 width={ICON_SIZE} height={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
      </Button>
      <SettingsDialog
        trigger={
          <Button type="button" variant="icon" size="icon">
            <SettingsIcon size={ICON_SIZE} />
          </Button>
        }
      />
    </div>
  );
};
