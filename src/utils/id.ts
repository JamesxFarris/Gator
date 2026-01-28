export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
};

export const generateShortId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
