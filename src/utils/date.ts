export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const isToday = (date: string): boolean => {
  return date === getToday();
};

export const isYesterday = (date: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date === formatDate(yesterday);
};

export const getDaysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (date: string, days: number): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export const subtractDays = (date: string, days: number): string => {
  return addDays(date, -days);
};

export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let current = startDate;

  while (current <= endDate) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
};

export const getLast7Days = (): string[] => {
  const today = getToday();
  return getDateRange(subtractDays(today, 6), today);
};

export const getLast30Days = (): string[] => {
  const today = getToday();
  return getDateRange(subtractDays(today, 29), today);
};

export const formatDisplayDate = (date: string): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
};

export const formatFullDate = (date: string): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getRelativeDay = (date: string): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDisplayDate(date);
};

export const getWeekday = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getMonthYear = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};
