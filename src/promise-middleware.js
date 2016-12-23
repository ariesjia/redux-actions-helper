import { isFSA } from 'flux-standard-action';
import omit from 'lodash/omit';
import { getActionName } from './createActionPrefix';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function isDeferred(val) {
  return val && val.promise && isPromise(val.promise);
}

function getMeta(action) {
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

export default ({ dispatch }) => next => (action) => {
  if (!isFSA(action)) {
    return next(action);
  }

  next(action)

  if (isPromise(action.payload)) {
    action.payload.then((result) => {
      dispatch({
        ...action,
        payload: result,
        type: getActionName(action.type)('success'),
        meta: getMeta(action),
      });
    }).catch((error) => {
      dispatch({
        ...action,
        error: true,
        payload: error instanceof Error ? error.message : error,
        type: getActionName(action.type)('fail'),
        meta: getMeta(action),
      });
    })
    return action.payload;
  } else if (isDeferred(action.payload)) {
    return action.payload.promise;
  }
  return null;
};
