import { useCallback, useState } from 'react';
import { BffError } from '@/shared/api';
import { useUpdateProfile } from '@/features/profile/api';
import { nicknameSchema } from './schemas';

interface NicknameEdit {
  isEditing: boolean;
  value: string;
  error: string | null;
  isPending: boolean;
  onEditStart: () => void;
  onCancel: () => void;
  onChange: (next: string) => void;
  onSave: () => Promise<void>;
}

const CONFLICT = 409;
const BAD_REQUEST = 400;

export const useNicknameEdit = (currentNickname: string): NicknameEdit => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentNickname);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useUpdateProfile();

  const onEditStart = useCallback(() => {
    setValue(currentNickname);
    setError(null);
    setIsEditing(true);
  }, [currentNickname]);

  const onCancel = useCallback(() => {
    setError(null);
    setIsEditing(false);
  }, []);

  const onChange = useCallback((next: string) => {
    setValue(next);
    setError(null);
  }, []);

  const onSave = useCallback(async () => {
    const parsed = nicknameSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid nickname');
      return;
    }
    try {
      await mutateAsync({ nickname: parsed.data });
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof BffError && err.status === CONFLICT) {
        setError('Nickname already taken');
      } else if (err instanceof BffError && err.status === BAD_REQUEST) {
        setError('Invalid nickname');
      } else {
        setError('Failed to update nickname');
      }
    }
  }, [value, mutateAsync]);

  return { isEditing, value, error, isPending, onEditStart, onCancel, onChange, onSave };
};
