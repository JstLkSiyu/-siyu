export function isArray(array: any): array is Array<any> {
  return Object.prototype.toString.call(array) === '[object Array]';
}

export function isObject(object: any): object is object {
  return Object.prototype.toString.call(object) === '[object Object]';
}

export function isString(string: any): string is string {
  return Object.prototype.toString.call(string) === '[object String]';
}

export function isNumber(number: any): number is number {
  return Object.prototype.toString.call(number) === '[object Number]';
}

export function isBoolean(boolean: any): boolean is boolean {
  return Object.prototype.toString.call(boolean) === '[object Boolean]';
}

export function isJSONStr(string: string) {
  try {
    const json = JSON.parse(string);
    if(isObject(json)) {
      return true;
    }
    return false;
  } catch(err) {
    return false;
  }
}