import { createAction, handleActions } from '../src'

describe('createAction', () => {
  it('create action should pass arguments to payload correct', () => {
    const addAction = createAction('ADD_TODO')
    const completeAaction = createAction('REMOVE_TODO')
    const reducer = handleActions((on)=>{
      on(addAction,(state,action)=>{
        state.task.push({
          ...action.payload,
          completed: false
        })
        return state
      })
      on(completeAaction,(state,action)=>{
        state.task[action.payload].completed = true
        return state
      })
    }, { task : [] });
    expect(
      reducer({ task : [] }, addAction({
        text:'hello'
      }))
    ).toEqual(
      { task : [{ text:'hello', completed: false }] }
    );

    expect(
      reducer({ task : [{ text:'hello', completed: false }] }, completeAaction(0))
    ).toEqual(
      { task : [{ text:'hello', completed: true }] }
    );

  });



  it('payload creator should correct', () => {
    const addAction = createAction('ADD_TODO',(text) =>{
        return {
          text,
          icon: 'todo'
        }
    })
    const reducer = handleActions((on)=>{
      on(addAction,(state,action)=>{
        state.task.push({
          ...action.payload,
          completed: false
        })
        expect(action.payload).toEqual({ text:'hello', icon: 'todo'});
        return state
      })
    }, { task : [] });

    expect(
      reducer({ task : [] }, addAction('hello'))
    ).toEqual(
      { task : [{ text:'hello', icon: 'todo', completed: false }] }
    );
  });


  it('meta creator should correct', () => {
    const now = + new Date()
    const addAction = createAction('ADD_TODO',(text) =>{
      return {
        text,
        icon: 'todo'
      }
    }, (text)=>{
      return {
        date: now
      }
    })
    const reducer = handleActions((on)=>{
      on(addAction,(state,action)=>{
        state.task.push({
          ...action.payload,
          completed: false
        })
        expect(action.meta.date).toEqual(now);
        return state
      })
    }, { task : [] });
    reducer({ task : [] }, addAction('hello'))
  });


})