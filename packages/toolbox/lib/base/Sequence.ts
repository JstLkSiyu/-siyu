type SeqElem = { callback: Function, result: AsyncTaskResult };
type SeqCtx = { doSeq: <T>(promise: Promise<T>, callback: (result: T) => void) => SeqCtx };
type AsyncTaskResult = any;

/**
 * create a sequence task context, all async tasks' callback function could be executed by sequence in the same context
 * @returns sequence task context
 */
export function createSeqCtx() {
  let idx = 0; // index tag to mark a async task
  let curr = 0; // the current executing callback function in a context
  let last = 0; // the last context pointer in a context
  let map: Map<number, SeqElem> = new Map();
  function deleteTagFromMap(tag: number) {
    map.delete(tag);
  }
  function setTagToMap(tag: number, exec: Function, result: AsyncTaskResult) {
    map.set(tag, { callback: exec, result: result });
  }
  function execCallback(callback: Function, result: AsyncTaskResult) {
    curr ++;
    if(typeof callback !== 'function') {
      callback = new Function();
    }
    return callback.call(null, result);
  }
  function getSeqElemByTag(tag: number): SeqElem | undefined {
    return map.get(tag);
  }
  /**
   * execute all callback function by sequence until callback does not exist in map
   */
  function clearWaiting() {
    while(curr <= last) {
      let { callback, result } = getSeqElemByTag(curr) ?? {};
      if(callback) {
        deleteTagFromMap(curr);
        execCallback(callback, result);
      } else {
        break;
      }
    }
  }
  /**
   * callback could not be executed currently must has a wait
   * @param tag waiting tag
   * @param callback waiting callback
   * @param result waiting result
   */
  function goWait(tag: number, callback: Function, result: AsyncTaskResult) {
    setTagToMap(tag, callback, result);
  }
  let seqCtx: SeqCtx = {
    doSeq: function<T extends AsyncTaskResult>(promise: Promise<T>, callback: (result: T) => void): SeqCtx {
      let tag = idx ++;
      last = Math.max(last, tag);
      promise.then(result => {
        if(tag === curr) {
          execCallback(callback, result);
          clearWaiting();
        } else {
          goWait(tag, callback, result);
        }
      });
      return seqCtx;
    }
  }
  return seqCtx;
};