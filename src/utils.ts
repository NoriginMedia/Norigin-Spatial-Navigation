/* eslint-disable import/prefer-default-export */

interface FindKeyPredicate<T> {
  (value: T, key: string, obj: { [key: string]: T }): boolean;
}

const findKey = <T>(
  obj: { [key: string]: T },
  predicate: FindKeyPredicate<T> = (o) => !!o
): string | undefined => Object.keys(obj).find((key) => predicate(obj[key], key, obj));

/**
 * This function only works for string or numbers since Set checks for reference equality,
 * meaning objects wouldn't work.
 */
const difference = <T extends string | number>(array: T[], ...values: T[][]): T[]  => {
  const exclusionSet = new Set(values.flat());
  return array.filter(item => !exclusionSet.has(item));
}

export { findKey, difference }
