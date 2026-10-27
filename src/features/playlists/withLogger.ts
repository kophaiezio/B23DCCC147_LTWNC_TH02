import type { Reducer } from 'react';

export function withLogger<State, Action>(reducer: Reducer<State, Action>): Reducer<State, Action> {
  return (state, action) => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) console.info('[playlist]', { action, previousState: state, nextState });
    return nextState;
  };
}
