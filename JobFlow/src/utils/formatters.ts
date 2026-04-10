import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}

export function formatDateShort(dateString: string): string {
  return format(new Date(dateString), 'MMM d');
}

export function formatRelative(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function formatDateForInput(dateString: string): string {
  return format(new Date(dateString), 'yyyy-MM-dd');
}

export function todayForInput(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
