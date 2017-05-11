import { createThunkAction, handleActions } from '../src'

describe('createThunkAction', () => {

  it('should auto create pending action for thunk action', () => {
    const TEST_ACTION = createThunkAction('TEST', () => {});
    const reducer = handleActions({
      [TEST_ACTION]:(state,action)=>{
        return action.payload
      },
    },{});
    expect(
      reducer({}, TEST_ACTION.pending(1))
    ).toEqual(1);
  });



})