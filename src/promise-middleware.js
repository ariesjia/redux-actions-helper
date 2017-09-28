import { isFSA } from 'flux-standard-action';
import omit from 'lodash/omit';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import { getActionName } from './createActionPrefix';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function isDeferred(val) {
  return val && val.promise && isPromise(val.promise);
}

function getPromiseFinishMeta(action) {
  return (action.meta && action.meta.PROMISE_ACTION)
    ? {
      ...action.meta,
      PROMISE_ACTION: {
        ...omit(action.meta.API_ACTION, 'PROMISE_START'),
        PROMISE_FINISH: true,
      },
    }
    : null;
}

function getPromiseStartMeta(action) {
  const originMeta = action.meta
  let meta
  if(isUndefined(originMeta) || isNull(originMeta)) {
    meta = {}
  } else if (isObject(originMeta)) {
    meta = originMeta
  } else {
    meta = {
      origin: originMeta
    }
  }
  return Object.assign({} , meta, {
    PROMISE_ACTION: {
      PROMISE_START: true,
    }
  })
}

export default ({ dispatch }) => next => (action) => {
  if (!isFSA(action)) {
    return next(action);
  }

  if (isPromise(action.payload)) {
    action.payload.then((result) => {
      dispatch({
        ...action,
        payload: result,
        type: getActionName(action.type)('success'),
        meta: getMeta(action),
      })
    }).catch((error) => {
      dispatch({
        ...action,
        error: true,
        payload: error instanceof Error ? error.message : error,
        type: getActionName(action.type)('fail'),
        meta: getPromiseFinishMeta(action),
      })
    })
    next({
      ...action,
      meta: getPromiseStartMeta(action),
    })
    return action.payload;
  } else if (isDeferred(action.payload)) {
    next({
      ...action,
      meta: getPromiseStartMeta(action),
    })
    return action.payload.promise;
  } else {
    next(action)
  }
  return null;
};
