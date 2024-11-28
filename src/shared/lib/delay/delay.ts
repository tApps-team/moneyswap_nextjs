export const delay = (ms?: number) => {
  return new Promise((resolve) => setTimeout(() => resolve("timeout end"), ms || 6000));
};
