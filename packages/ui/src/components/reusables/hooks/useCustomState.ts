/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AutoState<T extends Record<string, any>> = {
  [K in keyof T as T[K] extends boolean
    ? `is${Capitalize<string & K>}`
    : K]: T[K];
} & {
  [K in keyof T as T[K] extends boolean
    ? `set${Capitalize<`is${Capitalize<string & K>}`>}`
    : `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export function useCustomStates<T extends Record<string, any>>(
  initial: T,
): AutoState<T> {
  const [state, setState] = useState<T>(initial);

  const result = useMemo(() => {
    const obj: Record<string, any> = {};
    const keys = Object.keys(initial) as (keyof T)[];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const keyStr = String(key);
      const capitalizedKey = keyStr.charAt(0).toUpperCase() + keyStr.slice(1);

      const valueKey =
        typeof initial[key as keyof T] === "boolean"
          ? `is${capitalizedKey}`
          : keyStr;

      obj[valueKey] = state[key as keyof T];

      const capitalizedValueKey =
        valueKey.charAt(0).toUpperCase() + valueKey.slice(1);
      const setterKey = `set${capitalizedValueKey}`;

      obj[setterKey] = (value: T[keyof T]) => {
        setState((prev) => ({ ...prev, [key as keyof T]: value }));
      };
    }

    return obj as AutoState<T>;
  }, [state, initial]);

  return result;
}
