import React, { useEffect, createContext, useContext, useReducer } from 'react';
import { ByDayAggregation, PageHitByUser } from '../interfaces';
import fetchDecorator from '../utils/fetchFromApi';

interface DataState {
  loading: boolean,
  usersCount: number,
  pageHitsCount: number,
  uniqueUsersByDay: ByDayAggregation[],
  pageHitsByDay: ByDayAggregation[],
  pageHitsByUser: PageHitByUser[],
  error?: string
}

export enum DataActionTypes {
  FETCH = 'FETCH',
  SET_USERS_COUNT = 'SET_USERS_COUNT',
  SET_PAGE_HITS_COUNT = 'SET_PAGE_HITS_COUNT',
  SET_USERS_BY_DAY = 'SET_USERS_BY_DAY',
  SET_PAGE_HITS_BY_DAY = 'SET_PAGE_HITS_BY_DAY',
  SET_PAGE_HITS_BY_USER = 'SET_PAGE_HITS_BY_USER',
  SET_ERROR = 'SET_ERROR'
};

type DataAction = 
  | { type: DataActionTypes.FETCH }
  | { type: DataActionTypes.SET_USERS_COUNT, payload: number }
  | { type: DataActionTypes.SET_PAGE_HITS_COUNT, payload: number }
  | { type: DataActionTypes.SET_USERS_BY_DAY, payload: ByDayAggregation[] }
  | { type: DataActionTypes.SET_PAGE_HITS_BY_DAY, payload: ByDayAggregation[] }
  | { type: DataActionTypes.SET_PAGE_HITS_BY_USER, payload: PageHitByUser[] }
  | { type: DataActionTypes.SET_ERROR, payload: string };

interface DataPropsTypes {
  state: DataState,
  dispatch: React.Dispatch<DataAction>
}

const dataInitialState = {
  loading: false,
  usersCount: 0,
  pageHitsCount: 0,
  uniqueUsersByDay: [],
  pageHitsByDay: [],
  pageHitsByUser: []
}

const reducer = (
  state: DataState,
  action: DataAction
): DataState => {
  switch (action.type) {
    case DataActionTypes.FETCH:
      return { ...state ,loading: true };
    case DataActionTypes.SET_USERS_COUNT:
      return { ...state, loading: false, usersCount: action.payload };
    case DataActionTypes.SET_PAGE_HITS_COUNT:
      return { ...state, loading: false, pageHitsCount: action.payload };
    case DataActionTypes.SET_USERS_BY_DAY:
      return { ...state, loading: false, uniqueUsersByDay: action.payload };
    case DataActionTypes.SET_PAGE_HITS_BY_DAY:
      return { ...state, loading: false, pageHitsByDay: action.payload };
    case DataActionTypes.SET_PAGE_HITS_BY_USER:
        return { ...state, loading: false, pageHitsByUser: action.payload };
    case DataActionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const DataContext = createContext<DataPropsTypes>({
  state: dataInitialState,
  dispatch: () => {}
});
export const useDataContext = () => useContext(DataContext);

const usersReq = new Request(`${process.env.REACT_APP_API}/usersCount`);
const pageHitsReq = new Request(`${process.env.REACT_APP_API}/pageHitsCount`);
const usersByDayReq = new Request(`${process.env.REACT_APP_API}/uniqueUsersByDay`);
const pageHitsByDayReq = new Request(`${process.env.REACT_APP_API}/pageHitsByDay`);
const pageHitsByUserReq = new Request(`${process.env.REACT_APP_API}/pageHitsByUser`);

// Provider HOC
const DataStateProvider = <P extends {}>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithData: React.ComponentType<P> = (props) => {
    const [state, dispatch] = useReducer(reducer, dataInitialState);
    useEffect(() => {
      dispatch({ type: DataActionTypes.FETCH });
      fetchDecorator(usersReq)
        .then(res => dispatch({ type: DataActionTypes.SET_USERS_COUNT, payload: res }))
        .catch(err => dispatch({
          type: DataActionTypes.SET_ERROR,
          payload: `Error fetching usersReq: ${err}`
        }));

      fetchDecorator(pageHitsReq)
        .then(res => dispatch({ type: DataActionTypes.SET_PAGE_HITS_COUNT, payload: res }))
        .catch(err => dispatch({
          type: DataActionTypes.SET_ERROR,
          payload: `Error fetching pageHitsReq: ${err}`
        }));

      fetchDecorator(usersByDayReq)
        .then(res => dispatch({ type: DataActionTypes.SET_USERS_BY_DAY, payload: res }))
        .catch(err => dispatch({
          type: DataActionTypes.SET_ERROR,
          payload: `Error fetching usersByDayReq: ${err}`
        }));

      fetchDecorator(pageHitsByDayReq)
        .then(res => dispatch({ type: DataActionTypes.SET_PAGE_HITS_BY_DAY, payload: res }))
        .catch(err => dispatch({
          type: DataActionTypes.SET_ERROR,
          payload: `Error fetching pageHitsByDayReq: ${err}`
        }));

        fetchDecorator(pageHitsByUserReq)
        .then(res => dispatch({ type: DataActionTypes.SET_PAGE_HITS_BY_USER, payload: res }))
        .catch(err => dispatch({
          type: DataActionTypes.SET_ERROR,
          payload: `Error fetching pageHitsByUserReq: ${err}`
        }));

    }, [])
    return (
      <DataContext.Provider value={{ state, dispatch }}>
        <Component {...props} />
      </DataContext.Provider>
    )
  }

  return WithData;
}

export default DataStateProvider;