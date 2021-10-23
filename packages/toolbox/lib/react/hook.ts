import { useEffect, useRef, useState, useCallback } from 'react';
import { isString } from '../base/Check';
import { useProxy } from './initStore';

export function useWillMount(callback: Function) {
  const ref = useRef(true);
  if(ref.current) {
    callback();
    ref.current = false;
  }
}

export function useDidMount(callback: Function) {
  useEffect(() => {
    callback();
  }, []);
}

export function useWillUnmount(callback: Function) {
  useEffect(() => {
    return () => {
      callback();
    }
  }, []);
}

export function useDidUpdate(callback: Function) {
  useEffect(() => {
    callback();
  });
}

export function useWillUpdate(callback: Function) {
  const ref = useRef(true);
  if (ref.current) {
    ref.current = false;
  } else {
    callback();
  }
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(tick => tick + 1), []);
  return { forceUpdate };
}

export function useRendering() {
  const renderingRef = useRef(false);
  renderingRef.current = true;
  useEffect(() => {
    renderingRef.current = false;
  });
  return { renderingRef };
}

export function useLocalStorage() {
  let jsonStr = String('{');
  const keys = Array(localStorage.length).fill(0).map((_, key) => localStorage.key(key));
  keys.forEach(key => {
    const val = key ? (localStorage.getItem(key) ?? "null") : "null";
    jsonStr = jsonStr.concat(`"${key}":${val},`);
  });
  jsonStr = jsonStr.length > 1 ? jsonStr.substr(0, jsonStr.length - 1) : jsonStr;
  jsonStr = jsonStr.concat('}');
  const storageObj = JSON.parse(jsonStr);
  const restore = useCallback((item?: string) => {
    if(isString(item)) {
      localStorage.setItem(item, JSON.stringify(storageObj[item]));
    } else {
      keys.forEach(key => {
        key ? localStorage.setItem(key, JSON.stringify(storageObj[key])) : null;
      });
    }
  }, []);
  const storage = useProxy(storageObj, {
    touch: (tar, key: string) => queueMicrotask(() => restore(keys.find(k => k === key) ? undefined : key))
  });
  return storage;
}

export function useDebounce(callback: () => void, timeout: number = 200) {
  const execCallback = useCallback(() => {
    callback();
    clearTimeout(timeoutRef.current);
  }, []);
  const timeoutRef = useRef<any>(0);
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => execCallback(), timeout);
}

export function useThrottle(callback: () => void, timeout: number = 200) {
  const canExec = useRef(true);
  const execCallback = useCallback(() => {
    callback();
    setTimeout(() => {
      canExec.current = true;
    }, timeout);
    canExec.current = false;
  }, []);
  if(canExec.current) {
    execCallback();
  }
}

export * from './initStore';