import { useMemo, useReducer } from 'react';

export type ActionType<T> =
  | { type: 'reset' }
  | {
      [K in keyof T]: {
        field: K;
        value: T[K];
      };
    }[keyof T];

const useCreateReducer = <T>({ initialState }: { initialState: T }) => {
  const reducer = (state: T, action: ActionType<T>) => {
    if ('type' in action) {
      return initialState;
    }
    return { ...state, [action.field]: action.value };
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return useMemo(() => ({ state, dispatch }), [state, dispatch]);
};

export default useCreateReducer;
