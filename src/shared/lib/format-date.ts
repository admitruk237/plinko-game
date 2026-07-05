export const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const DATE_PAD_LENGTH = 2;
const DATE_PAD_CHAR = '0';
const DATE_SEPARATOR = '/';
const TIME_SEPARATOR = ':';
const DATETIME_SEPARATOR = ', ';

export const formatFullTimestamp = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(DATE_PAD_LENGTH, DATE_PAD_CHAR);
  const month = String(date.getMonth() + 1).padStart(DATE_PAD_LENGTH, DATE_PAD_CHAR);
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(DATE_PAD_LENGTH, DATE_PAD_CHAR);
  const minutes = String(date.getMinutes()).padStart(DATE_PAD_LENGTH, DATE_PAD_CHAR);
  const seconds = String(date.getSeconds()).padStart(DATE_PAD_LENGTH, DATE_PAD_CHAR);
  return `${day}${DATE_SEPARATOR}${month}${DATE_SEPARATOR}${year}${DATETIME_SEPARATOR}${hours}${TIME_SEPARATOR}${minutes}${TIME_SEPARATOR}${seconds}`;
};
