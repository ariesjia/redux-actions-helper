# redux-actions-helper
> helper for redux-actions

![travis-ci](https://travis-ci.org/ariesjia/redux-actions-helper.svg?branch=master)

## Installation

```bash
npm install redux-actions-helper --save
```

### createAction
```js
createAction(
  actionsName:string,
  payloadCreator: function,
  metaCreator: function,
)
```

- payloadCreator: ```(args) => payload```

  default: ```(...args) => args```
  
  
- metaCreator: ```(args) => payload```

  default: ```(...args) => args```

```js
//  actions/todo.js

import { createAction } from 'redux-actions-helper';

export const toggleTODO = createAction(
  'TOGGLE_TODO'
);

export const updateTODO = createAction(
  'UPDATE_TODO', (task)=>({
    id: task.id,
    task
  })
);

// you can get action name by name attribute or toString method
// toggleTODO.name  is equal 'TOGGLE_TODO'
// toggleTODO.toString()  is equal 'TOGGLE_TODO'

```

mapToAction then use it 
 
```js
//  app/Home.js

this.props.toggleTODO(1)

this.props.updateTODO({
  id: 1,
  title: 'new'
})
```


### listenActions
```js
//  reducer/todo.js
import { listenActions, handleActions } from 'redux-actions-helper';
import * as todoActions from '../../actions/todo'

const initState = {
  tasks: []
}

export default listenActions((on) => {
  on(todoActions.toggleTODO, (state, action) => {
    const taskId = action.payload
    return {
      ...
    }
  })
  on(todoActions.updateTODO, (state, action) => {
    const {id, task} = action.payload
    return {
      ...
    }
  })
}, initState)

// ==== you also can use handleActions , is same

handleActions({
  [todoActions.toggleTODO]:(state, action) => {
    const taskId = action.payload
    return {
     ...
    }
  },
  [todoActions.updateTODO]:(state, action) => {
    const {id, task} = action.payload
    return {
     ...
    }
  }
}, initState)

```


### async

add promise-middleware to middlewares

```js
import { promiseMiddleware } from 'redux-actions-helper';

applyMiddleware(
  ...
  promiseMiddleware,
  ...
)

```

```js
//  actions/todo.js
import { createAction } from 'redux-actions-helper';

export const updateTODO = createAction(
  'UPDATE_TODO', (task)=>{
    return taskApi.update(task) //api will return a promise
  }
);
```

```js
//  reducer/todo.js
import { listenActions } from 'redux-actions-helper';
import * as todoActions from '../../actions/todo'

const initState = {
  tasks: []
}

//handleActions 
handleActions({
  [todoActions.updateTODO]:(state, action) => {
    // api start
    const requestArguments = action.payload // task
    return {
      ...
    }
  },
  [todoActions.updateTODO.success]:(state, action) => {
    // promise resolve
    const response = action.payload
    const requestArguments = action.meta // task
    return {
      ...
    }
  },
  [todoActions.updateTODO.fail]:(state, action) => {
    // promise reject 
    const error = action.payload
    const requestArguments = action.meta // task
    return {
      ...
    }
  }
}, initState)

//listenActions 
export default listenActions((on) => {
  on(todoActions.updateTODO, (state, action) => {
    // api start
    const requestArguments = action.payload // task
    return {
      ...
    }
  })
  on.success(todoActions.updateTODO, (state, action) => {
    // promise resolve
      const response = action.payload
      const requestArguments = action.meta // task
      return {
        ...
      }
  })
  on.fail(todoActions.updateTODO, (state, action) => {
    // promise reject 
      const error = action.payload
      const requestArguments = action.meta // task
      return {
        ...
      }
  })
}, initState)

```


### createThunkAction
if you use thunk middleware, you can use `createThunkAction`

```js
createThunkAction(
  actionsName: string,
  payloadCreator: ({ dispatch, getState }, args) => payload,
  metaCreator: (args) => meta,
)
```

```js
//  actions/todo.js
import { createThunkAction } from 'redux-actions-helper';

export const updateTODO = createThunkAction(
  'UPDATE_TODO', ({ dispatch, getState }, task)=>{
    const state = getState()
    return {
      id: task.id,
      task,
      operator: state.user.id
    }
  }
);
```
use it as same as createAction 
createThunkAction will auto create 'pending, success, fail' action.

```js
//  app/Home.js

this.props.updateTODO({
  id: 1,
  title: 'new'
})
```