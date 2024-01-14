import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export const fToNow = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
