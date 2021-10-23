import React from 'react';

export function useReactInternal() {
  type ReactCurrentDispatcher = {
    current: any;
  };
  type ReactCurrentBatchConfig = {
    transition: any;
  };
  type ReactCurrentOwner = {
    current: any;
  };
  type IsSomeRendererActing = {
    current: boolean;
  };
  type ReactInternal = {
    ReactCurrentDispatcher: ReactCurrentDispatcher;
    ReactCurrentBatchConfig: ReactCurrentBatchConfig;
    ReactCurrentOwner: ReactCurrentOwner;
    IsSomeRendererActing: IsSomeRendererActing;
    assign: any;
  };
  const internalKey = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';
  const internal = Reflect.get(React, internalKey);
  return {
    internal: internal as ReactInternal
  }
}