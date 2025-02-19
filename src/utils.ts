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
const difference = <T extends string | number>(array: T[], ...values: T[][]): T[] => {
  const exclusionSet = new Set(values.flat());
  return array.filter(item => !exclusionSet.has(item));
}

const noop: VoidFunction = () => null;

let counter = 0;

const uniqueId = (prefix: string = ''): string => {
  counter += 1;
  return `${prefix}${counter}`;
};

type DebouncedFunc<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  { leading = false, trailing = true }: { leading?: boolean; trailing?: boolean }
): DebouncedFunc<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const invokeFunc = (args: Parameters<T>) => {
    func(...args);
  };

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;

    if (leading && !timeoutId) {
      invokeFunc(args); // Call immediately on the first call
    }

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      if (trailing && lastArgs) {
        invokeFunc(lastArgs); // Call on trailing edge
      }
      timeoutId = null;
    }, wait);
  };

  // Add the cancel method to clear any pending timeout
  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}

type ThrottleFunc<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

const throttle = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  { leading = true, trailing = true }: { leading?: boolean; trailing?: boolean } = {}
): ThrottleFunc<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecuted = 0;
  let lastArgs: Parameters<T> | null = null;

  const invokeFunc = (args: Parameters<T>) => {
    func(...args);
    lastExecuted = Date.now();
  };

  const throttled: ThrottleFunc<T> = (...args: Parameters<T>) => {
    const now = Date.now();
    const remainingTime = wait - (now - lastExecuted);

    if (remainingTime <= 0) {
      if (leading) {
        invokeFunc(args);  // Call immediately if enough time has passed
      }
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        if (lastArgs) {
          invokeFunc(lastArgs);  // Call the function on trailing edge
        }
        timeoutId = null;
      }, remainingTime);
    }

    lastArgs = args;
  };

  throttled.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };

  return throttled;
};

export { findKey, difference, debounce, DebouncedFunc, throttle, noop, uniqueId }
