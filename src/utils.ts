/* eslint-disable import/prefer-default-export */

interface FindKeyPredicate<T> {
  (value: T, key: string, obj: { [key: string]: T }): boolean;
}

const findKey = <T>(
  obj: { [key: string]: T },
  predicate: FindKeyPredicate<T> = (o) => !!o
): string | undefined => Object.keys(obj).find((key) => predicate(obj[key], key, obj));

export { findKey }
