import { createSeqCtx } from '../base/Sequence';

export function createSeqAjaxCtx() {
  const seqCtx = createSeqCtx();
  return {
    seqPost: async function(url: string, data?: any) {
      let fetchPromise = fetch(url, {
        method: 'post',
        body: data ?? {}
      });
      return new Promise<Response>(resolve => {
        seqCtx.doSeq(fetchPromise, function(resp) {
          resolve(resp);
        });
      });
    },
    seqGet: async function(url: string) {
      let fetchPromise = fetch(url, {
        method: 'get'
      });
      return new Promise<Response>(resolve => {
        seqCtx.doSeq(fetchPromise, function(resp) {
          resolve(resp);      
        });
      });
    }
  }
}

const seqAjaxCtx = createSeqAjaxCtx();

export const seqPost = seqAjaxCtx.seqPost;

export const seqGet = seqAjaxCtx.seqGet;