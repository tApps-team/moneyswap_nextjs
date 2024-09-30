type IsEmptyObjectProps<T> = {
  obj: T;
};
export const IsEmptyObject = <T extends object>(props: IsEmptyObjectProps<T>): boolean => {
  for (let i in props.obj) return false;
  return true;
};
