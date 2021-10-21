import { FC, useCallback, useEffect, useMemo } from 'react';
import { initStore } from '@toolbox/react/hook';

const storeMap: any = {};

// 组件联动hooks
const useComponentAssembly = function <C extends object> (name: string, targets: any[], context: C) {
  useEffect(() => {
    return () => {
      delete storeMap[name];
    }
  }, []);
  useMemo(() => {
    storeMap[name] = initStore(context);
  }, []);
  const useStore = storeMap[name];
  const { store } = useStore();
  const dispatch = useCallback(() => {
    targets.forEach((target: any) => {
      const { component, action } = target;
      action(storeMap[component]?.current);
    });
  }, []);
  return { store: store as Partial<C>, dispatch };
}

const pushHightlight = function (ctx: any) {
  ctx?.hightlight?.push?.('hi');
}

const addNumber = function (ctx: any) {
  ctx.number = 'number' in ctx ? ctx.number + 1 : 0;
}

const Component1: FC<any> = props => {
  const { name, targets } = props;
  const { store, dispatch } = useComponentAssembly(name, targets, { number: 0 });
  return (
    <div>
      <h1>Component1 - {name}</h1>
      <b>{store.number}</b>
      <button onClick={() => dispatch()}>to component2</button>
    </div>
  )
}

const Component2: FC<any> = props => {
  const { name, targets = [] } = props;
  const { store, dispatch } = useComponentAssembly(name, targets, { hightlight: [] as string[] })
  return (
    <div>
      <h1>Component2 - {name}</h1>
      <b>{store.hightlight?.join?.(',')}</b>
      <button onClick={() => dispatch()}>to component1</button>
    </div>
  )
}

const profile = {
  'component1-1': [{
    // component1-1 向 component2-1 发送动作pushHightlight
    component: 'component2-1',
    action: pushHightlight
  }],
  'component2-1': [{
    // component2-1 向 component1-1 发送动作addNumber
    component: 'component1-1',
    action: addNumber
  }]
}

const Lab: FC = props => {
  return (
    <div>
      <Component1 name={'component1-1'} targets={profile['component1-1']} />
      <Component2 name={'component2-1'} targets={profile['component2-1']} />
      <Component2 name={'component2-2'} />
    </div>
  )
}

export default Lab;