import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { isArray, isObject, isString } from '../base/Check';
import { cloneDeep } from 'lodash';
import type { Proxy } from '../types/ToolType';

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
  callback();
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(tick => tick + 1), []);
  return { forceUpdate };
}

interface ProxyHookHandle<O> {
  touch: (tar: O, key: string, val: any, receiver: any) => void;
}

export function useProxy<O extends object>(object: O, hookHandle?: ProxyHookHandle<O>, handle?: ProxyHandler<O>) {
  const proxyCache: Map<object, Proxy> = useMemo(() => new Map(), []);
  const ARR_LEN_SYM = Symbol('ARRAY_LENGTH_SYMBOL');
  const getProxy = useCallback(<O extends object>(object: O) => {
    if(proxyCache.has(object)) {
      return proxyCache.get(object) as Proxy<O>;
    }
    if (new Set(proxyCache.values()).has(object)) {
      return object;
    }
    let proxyHandle: ProxyHandler<O> = {
      set(tar: any, key: string, val: any, receiver: any) {
        if(
          tar[key] !== val ||
          isArray(tar) && key === 'length' && Reflect.get(tar, ARR_LEN_SYM) !== val
        ) {
          if(isObject(val) || isArray(val)) {
            val = getProxy(val);
          }
          hookHandle?.touch(tar, key, val, receiver);
        }
        if (isArray(tar)) {
          Reflect.set(tar, ARR_LEN_SYM, tar.length);
        }
        return Reflect.set(tar, key, val) && (handle?.set?.(tar, key, val, receiver) ?? true);
      },
      get(tar: any, key: string, receiver: any) {
        let val = handle?.get?.(tar, key, receiver) ?? tar[key];
        if(isObject(val) || isArray(val)) {
          val = getProxy(val);
        }
        return val;
      }
    }
    if(handle) {
      proxyHandle = Object.assign({}, handle, proxyHandle);
    }
    const proxy = new Proxy<O>(object, proxyHandle);
    proxyCache.set(object, proxy);
    return proxy;
  }, []);
  return useMemo(() => getProxy(object), []);
}

const _useReactiveState = function <O extends object> (reactiveState: O) {
  const onTouchRef = useRef<Function | null>(null);
  const onGetRef = useRef<Function | null>(null);
  const { forceUpdate } = useForceUpdate();
  const stateProxy = useProxy<O>(reactiveState, {
    touch: (tar: any, key: string, val: any, receiver: any) => {
      forceUpdate();
      onTouchRef.current?.(tar, key, val, receiver);
    }
  }, {
    get: (tar: any, key: string, receiver: any) => {
      onGetRef.current?.(tar, key, receiver);
    }
  });
  const setOnTouch = useCallback((onTouch: Function) => {
    onTouchRef.current = onTouch;
  }, []);
  const setOnGet = useCallback((onGet: Function) => {
    onGetRef.current = onGet;
  }, []);
  return { stateProxy, forceUpdate, setOnTouch, setOnGet };
}

export function useReactiveState<O extends object>(reactiveState: O) {
  const { stateProxy } = _useReactiveState(reactiveState);
  return stateProxy;
}

export function useRendering() {
  const renderingRef = useRef(false);
  renderingRef.current = true;
  useEffect(() => {
    renderingRef.current = false;
  });
  return { renderingRef };
}

export function initStore <S extends object> (store: S) {
  const updaterMap: Map<symbol, { update: Function; acceptKeys: Set<string> }> = new Map();
  const cloneStore: S = cloneDeep(store);

  type UseStore = (() => { store: S }) & { current?: S };

  const useStore: UseStore = function useStore() {
    const { stateProxy: $store, forceUpdate, setOnTouch, setOnGet } = _useReactiveState(cloneStore);
    Reflect.set(useStore, 'current', $store);
    const keyMap = new Map();
    const registList: Set<string> = new Set();
    const { renderingRef } = useRendering();

    setOnTouch((tar: any, key: string) => {
      if (!isString(key)) {
        return;
      }
      const touchPrefix = keyMap.get(tar);
      const touchKey =  touchPrefix ? `${touchPrefix}.${key}` : key;
      updaterMap.forEach(updater => {
        if (updater.acceptKeys.has(touchKey)) {
          updater.update();
        }
      });
    });
    setOnGet((tar: any, key: string) => {
      if (!isString(key)) {
        return tar[key];
      }
      const val = tar[key];
      const keyPrefix = keyMap.get(tar);
      if (keyPrefix) {
        key = `${keyPrefix}.${key}`;
      }
      !keyMap.has(val) && keyMap.set(val, key);
      renderingRef.current && registList.add(key);
    });

    const id = useMemo(() => Symbol(), []);
    useEffect(() => {
      updaterMap.set(id, {
        update: forceUpdate,
        acceptKeys: registList
      });
      return () => {
        updaterMap.delete(id);
      }
    }, [forceUpdate]);
    return {
      store: $store
    }
  }

  return useStore;
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
  const timeoutRef = useRef(0);
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => execCallback, timeout);
}

export function useTrottle(callback: () => void, timeout: number = 200) {
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