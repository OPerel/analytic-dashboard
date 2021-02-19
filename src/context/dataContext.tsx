import React, { createContext, useContext, useReducer } from 'react';
import { User, PageHit } from '../interfaces';


interface DataState {
  loading: boolean,
  users: User[],
  pageHits: PageHit[],
  uniqueUsersByDay: User[],
  pageHitsByDay: PageHit[],
  error?: string
}

export enum DataActionTypes {
  FETCH = 'FETCH',
  SET_USERS = 'SET_USERS',
  SET_PAGE_HITS = 'SET_PAGE_HITS',
  SET_USERS_BY_DAY = 'USERS_BY_DAY',
  SET_PAGE_HITS_BY_DAY = 'PAGE_HITS_BY_DAY',
  SET_ERROR = 'SET_ERROR'
};

type DataAction = 
  | { type: DataActionTypes.FETCH }
  | { type: DataActionTypes.SET_USERS, payload: User[] }
  | { type: DataActionTypes.SET_PAGE_HITS, payload: PageHit[] }
  | { type: DataActionTypes.SET_USERS_BY_DAY, payload: User[] }
  | { type: DataActionTypes.SET_PAGE_HITS_BY_DAY, payload: PageHit[] }
  | { type: DataActionTypes.SET_ERROR, payload: string };

interface RawDataProvider {
  state: DataState,
  dispatch: React.Dispatch<DataAction>
}

const dataInitialState = {
  loading: false,
  users: [],
  pageHits: [],
  uniqueUsersByDay: [],
  pageHitsByDay: [],
}

const reducer = (
  state: DataState,
  action: DataAction
): DataState => {
  switch (action.type) {
    case DataActionTypes.FETCH:
      return { ...state ,loading: true };
    case DataActionTypes.SET_USERS:
      return { ...state, loading: false, users: action.payload };
    case DataActionTypes.SET_PAGE_HITS:
      return { ...state, loading: false, pageHits: action.payload };
    case DataActionTypes.SET_USERS_BY_DAY:
      return { ...state, loading: false, uniqueUsersByDay: action.payload };
    case DataActionTypes.SET_PAGE_HITS_BY_DAY:
      return { ...state, loading: false, pageHitsByDay: action.payload };
    case DataActionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const DataContext = createContext<RawDataProvider>({
  state: dataInitialState,
  dispatch: () => {}
});
export const useDataContext = () => useContext(DataContext);

// Provider HOC
const DataStateProvider = <P extends {}>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithAuth: React.ComponentType<P> = (props) => {
    const [state, dispatch] = useReducer(reducer, dataInitialState);
    return (
      <DataContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </DataContext.Provider>
    )
  }

  return WithAuth;
}

export default DataStateProvider;