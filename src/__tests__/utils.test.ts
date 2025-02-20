import { findKey, difference, debounce, throttle, noop, uniqueId, shuffle } from '../utils';

describe('utils', () => {
  describe('findKey', () => {
    it('should find the key based on the predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = (value: number) => value === 2;
      expect(findKey(obj, predicate)).toBe('b');
    });

    it('should return undefined if no key matches the predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = (value: number) => value === 4;
      expect(findKey(obj, predicate)).toBeUndefined();
    });
  });

  describe('difference', () => {
    it('should return the difference between arrays', () => {
      expect(difference([1, 2, 3], [2, 3])).toEqual([1]);
      expect(difference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
    });

    it('should return the original array if no values are excluded', () => {
      expect(difference([1, 2, 3], [])).toEqual([1, 2, 3]);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce a function', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);
      debouncedFunc();
      debouncedFunc();
      jest.advanceTimersByTime(50);
      debouncedFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should cancel a debounced function', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);
      debouncedFunc();
      jest.advanceTimersByTime(50)
      debouncedFunc.cancel();
      jest.advanceTimersByTime(100);
      expect(func).not.toHaveBeenCalled();
    });

    it('should debounce a function with leading option', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100, { leading: true });
      debouncedFunc();
      debouncedFunc();
      jest.advanceTimersByTime(50);
      debouncedFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should debounce a function with trailing option', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100, { trailing: true });
      debouncedFunc();
      debouncedFunc();
      jest.advanceTimersByTime(50);
      debouncedFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should debounce a function with both leading and trailing options', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100, { leading: true, trailing: true });
      debouncedFunc();
      debouncedFunc();
      jest.advanceTimersByTime(50);
      debouncedFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should debounce a function with both leading and trailing options set to false', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100, { leading: false, trailing: false });
      debouncedFunc();
      debouncedFunc();
      jest.advanceTimersByTime(50);
      debouncedFunc();
      jest.advanceTimersByTime(100);
      expect(func).not.toHaveBeenCalled();
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should throttle a function', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100);
      throttledFunc();
      throttledFunc();
      jest.advanceTimersByTime(50);
      throttledFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should cancel a throttled function', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100);
      throttledFunc();
      throttledFunc.cancel();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should throttle a function with leading option', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100, { leading: true });
      throttledFunc();
      throttledFunc();
      jest.advanceTimersByTime(50);
      throttledFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should throttle a function with trailing option', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100, { trailing: true });
      throttledFunc();
      throttledFunc();
      jest.advanceTimersByTime(50);
      throttledFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should throttle a function with both leading and trailing options', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100, { leading: true, trailing: true });
      throttledFunc();
      throttledFunc();
      jest.advanceTimersByTime(50);
      throttledFunc();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should throttle a function with both leading and trailing options set to false', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100, { leading: false, trailing: false });
      throttledFunc();
      throttledFunc();
      jest.advanceTimersByTime(50);
      throttledFunc();
      jest.advanceTimersByTime(100);
      expect(func).not.toHaveBeenCalled();
    });
  });

  describe('noop', () => {
    it('should do nothing', () => {
      expect(noop()).toBeUndefined();
    });
  });

  describe('uniqueId', () => {
    it('should generate unique ids with a prefix', () => {
      expect(uniqueId('prefix_')).toBe('prefix_1');
      expect(uniqueId('prefix_')).toBe('prefix_2');
    });

    it('should generate unique ids without a prefix', () => {
      expect(uniqueId()).toBe('3');
      expect(uniqueId()).toBe('4');
    });
  });

  describe('shuffle', () => {
    it('should shuffle an array', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffledArray = shuffle(array);
      expect(shuffledArray).not.toEqual(array);
      expect(shuffledArray.sort()).toEqual(array.sort());
    });
  });
});
