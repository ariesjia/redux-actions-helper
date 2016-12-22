import { createAction, handleActions } from '../src'

describe('handleActions', () => {

  it('create action should pass arguments to payload correct', () => {
    const TEST_ACTION = createAction('TEST')
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        state = action.payload
        return state
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

  it('create actions support multi arguments , is different from redux-actions', () => {
    const TEST_ACTION = createAction('TEST')
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        state={
          ...action.payload,
        }
        return state
      },
    },{});

    expect(
      reducer({}, TEST_ACTION({},1,2,3))
    ).toEqual(
      {0:{},1:1,2:2,3:3}
    );
  });

})