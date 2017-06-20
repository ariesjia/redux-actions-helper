import { createAction, handleActions } from '../src'

describe('handleActions', () => {

  it('should get action name by name field', () => {
    const actionName = 'TEST';
    const TEST_ACTION = createAction(actionName)
    expect(
      TEST_ACTION.name
    ).toEqual(actionName);
  });

  it('should pass arguments when payload creator is null', () => {
    const TEST_ACTION = createAction('TEST')
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        return action.payload
      },
    },{});
    expect(
      reducer({}, TEST_ACTION(1))
    ).toEqual(1);

    expect(
      reducer({}, TEST_ACTION())
    ).toEqual(undefined);

    expect(
      reducer({}, TEST_ACTION('string'))
    ).toEqual('string');

    expect(
      reducer({}, TEST_ACTION(true))
    ).toEqual(true);

    expect(
      reducer({}, TEST_ACTION({
        text:'hello'
      }))
    ).toEqual(
      { text:'hello' }
    );
  });

  it('should support multi arguments, is different from redux-actions', () => {
    const TEST_ACTION = createAction('TEST')
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        return {
          ...action.payload,
        }
      },
    },{});

    expect(
      reducer({}, TEST_ACTION({},1,2,3))
    ).toEqual(
      {0:{},1:1,2:2,3:3}
    );
  });

  it('should support payload creator is not function', () => {
    const payload = {x: 1};
    const TEST_ACTION = createAction('TEST', payload)
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        return {
          ...action.payload,
        }
      },
    },{});
    expect(
      reducer({}, TEST_ACTION())
    ).toEqual(payload);
  })

  it('should support meta creator is not function', () => {
    const payload = {x: 1};
    const meta = {x: 1};
    const TEST_ACTION = createAction('TEST', payload, meta)
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        return {
          payload:{
            ...action.payload
          },
          meta:{
            ...action.meta
          },
        }
      },
    },{});
    expect(
      reducer({}, TEST_ACTION())
    ).toEqual({
      payload,
      meta,
    });
  })

  it('should support argument is null', () => {
    const TEST_ACTION = createAction('TEST')
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        return action.payload
      },
    },1);
    expect(
      reducer({}, TEST_ACTION(null))
    ).toEqual(null);
  })

})