import axios from 'axios';
import { PLAYERS_FETCH_REQUEST, PLAYERS_FETCH_SUCCESS, PLAYERS_FETCH_FAILURE } from '../constants';
function requesting() {
  return { type: PLAYERS_FETCH_REQUEST };
}
function requestSuccess(data) {
  return {
    type: PLAYERS_FETCH_SUCCESS,
    payload: { data: data.data, meta: data.meta }
  };
}
function requestError(error) {
  return {
    type: PLAYERS_FETCH_FAILURE,
    payload: error
  };
}
export default function fetchPlayers(args = {}) {
  // Request parameters
  const params = {};
  if (typeof (args['page']) !== 'undefined') {
    params["page"] = args['page']
  }
  if (typeof (args['sort']) !== 'undefined') {
    params["sort"] = args['sort']
  }
  if (typeof (args['sort_dir']) !== 'undefined')   {
    params["sort_dir"] = args['sort_dir']
  }
  if (typeof (args['name']) !== 'undefined')   {
    params["name"] = args['name']
  }

  return function (dispatch) {
    dispatch(requesting());
    axios.get(`/api/v1/players.json`, { params })
      .then(response => {
        dispatch(requestSuccess(response.data));
      })
      .catch(error => {
        dispatch(requestError('Oops!! Please try after sometime.'));
      });
  };
}