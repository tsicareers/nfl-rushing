import { PLAYERS_FETCH_REQUEST, PLAYERS_FETCH_SUCCESS, PLAYERS_FETCH_FAILURE } from '../constants';
const INITIAL_STATE = { all: [], meta: null, isFetching: false, isError: false, errorMessage: null };
export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PLAYERS_FETCH_REQUEST:
      return { ...state, isFetching: true, isError: false, errorMessage: null };
    case PLAYERS_FETCH_SUCCESS:
      return { ...state, isFetching: false, isError: false, all: action.payload.data, meta: action.payload.meta };
    case PLAYERS_FETCH_FAILURE:
      return { ...state, isFetching: false, isError: true, errorMessage: action.payload };
    default:
      return state;
  }
}