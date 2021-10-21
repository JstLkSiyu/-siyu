import { FC, useCallback, useEffect, useMemo } from 'react';
import { initStore } from '@toolbox/react/hook';

const storeMap: any = {};

type Task = Array<{
  component: string;
  action: (ctx: any) => void;
}>;

// 组件联动hooks
const useComponentAssembly = function <C extends object> (name: string, tasks: Task[], context: C) {
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
  const dispatch = useCallback((taskName: string) => {
    for (const _taskName in tasks) {
      if (taskName === _taskName) {
        const task = tasks[_taskName];
        task.forEach(target => {
          const { component, action } = target;
          action(storeMap[component]?.current);
        });
      }
    }
  }, []);
  return { store: store as Partial<C>, dispatch: dispatch as (task: string) => void };
}

const pushHightlight = function (ctx: any) {
  ctx?.hightlight?.push?.('hi');
}

const addNumber = function (ctx: any) {
  ctx.number = 'number' in ctx ? ctx.number + 1 : 0;
}

const Component1: FC<any> = props => {
  const { name, tasks = [] } = props;
  const { store, dispatch } = useComponentAssembly(name, tasks, { number: 0 });
  return (
    <div>
      <h1>Component1 - {name}</h1>
      <b>{store.number}</b>
      <button onClick={() => dispatch('pushHightlightTo2')}>component2.hightlight.push('hi')</button>
    </div>
  )
}

const Component2: FC<any> = props => {
  const { name, tasks = [] } = props;
  const { store, dispatch } = useComponentAssembly(name, tasks, { hightlight: [] as string[] })
  return (
    <div>
      <h1>Component2 - {name}</h1>
      <b>{store.hightlight?.join?.(',')}</b>
      <button onClick={() => dispatch('addNumberFor1')}>component1.number++</button>
    </div>
  )
}

type Profile = {
  [component: string]: {
    [task: string]: Task;
  };
}

const profile: Profile = {
  'component1-1': {
    'pushHightlightTo2': [{
      // component1-1 向 component2-1 发送动作pushHightlight
      component: 'component2-1',
      action: pushHightlight
    // }, {
    //   component: 'component2-2',
    //   action: pushHightlight
    }]
  },
  'component2-1': {
    'addNumberFor1': [{
      // component2-1 向 component1-1 发送动作addNumber
      component: 'component1-1',
      action: addNumber
    }]
  }
}

const Lab: FC = props => {
  return (
    <div>
      <Component1 name={'component1-1'} tasks={profile['component1-1']} />
      <Component2 name={'component2-1'} tasks={profile['component2-1']} />
      <Component2 name={'component2-2'} />
    </div>
  )
}

export default Lab;