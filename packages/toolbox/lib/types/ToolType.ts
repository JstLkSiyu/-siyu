export type Object<O> = { [K in keyof O]: O[K] };
export type Proxy<O extends object = object> = O; 