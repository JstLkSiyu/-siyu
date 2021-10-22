import { useEffect, useCallback, useMemo, useRef } from 'react';
import { cloneDeep } from 'lodash';
import { useRendering, useForceUpdate } from './hook';
import { isString, isArray, isObject } from '../base/Check';
import type { Proxy } from '@/types/ToolType';

interface ProxyHookHandle<O> {
  touch: (tar: O, key: string, val: any, receiver: any) => void;
}

const IS_PROXY_SYM = Symbol('IS_PROXY_SYMBOL');
const PROXY_TAR_SYM = Symbol('PROXY_TAR_SYMBOL');
const ARR_LEN_SYM = Symbol('ARRAY_LENGTH_SYMBOL');

export function useProxy<O extends object>(object: O, hookHandle?: ProxyHookHandle<O>, handle?: ProxyHandler<O>) {
  const proxyCache: Map<object, Proxy> = useMemo(() => new Map(), []);
  const isProxy = useCallback(<O extends object>(object: O) => {
    return Boolean(Reflect.get(object, IS_PROXY_SYM));
  }, []);
  const getProxy = useCallback(<O extends object>(object: O) => {
    if(proxyCache.has(object)) {
      return proxyCache.get(object) as Proxy<O>;
    }
    if (isProxy(object)) {
      if (new Set(proxyCache.values()).has(object)) {
        return object;
      } else {
        return Reflect.get(object, PROXY_TAR_SYM);
      }
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
      get(tar: any, key: string | symbol, receiver: any) {
        if (key === IS_PROXY_SYM) {
          return true;
        } else if (key === PROXY_TAR_SYM) {
          return tar;
        }
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